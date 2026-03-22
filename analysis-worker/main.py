#!/usr/bin/env python3
"""
Analysis Worker: polls Supabase for pending file analysis jobs,
processes them via SellerAmp API, applies user filters, stores results.
Runs 24/7 on Hetzner server.
"""
import asyncio
import json
import os
import time
import traceback

from dotenv import load_dotenv
from supabase import create_client

from config import COUNTRIES, POLL_INTERVAL
from selleramp import SellerAmpClient
from file_parser import parse_file
from analyzer import analyze_product
from filters import apply_filters

load_dotenv()

SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_KEY']
WORKER_SECRET = os.environ['WORKER_SECRET']
SAS_EMAIL = os.environ['SAS_EMAIL']
SAS_PASSWORD = os.environ['SAS_PASSWORD']


def get_supabase():
    return create_client(SUPABASE_URL, SUPABASE_KEY)


async def process_job(job: dict, sas: SellerAmpClient, sb):
    """Process a single file analysis job."""
    job_id = job['id']
    t0 = time.time()

    try:
        filters = job.get('filters') or {}
        country_code = filters.get('country', 'FR')
        if country_code not in COUNTRIES:
            raise ValueError(f"Unknown country: {country_code}")

        country = COUNTRIES[country_code]
        keepa_mp = country['keepa_mp']

        # 1. Download file from Storage
        print(f"  [1] Downloading file: {job['file_name']}")
        file_path = job['file_path']
        res = sb.storage.from_('file-uploads').download(file_path)
        file_bytes = res

        # 2. Parse file + use frontend column mapping if provided
        print(f"  [2] Parsing file...")
        frontend_mapping = job.get('column_mapping')
        rows, column_mapping = parse_file(file_bytes, job['file_name'], frontend_mapping)
        total_rows = len(rows)
        print(f"      {total_rows} valid rows, mapping: {column_mapping}")

        if total_rows == 0:
            raise ValueError("No valid rows found in file (need ASIN/EAN + price)")

        # 3. Extract unique ASINs
        asin_list = []
        asin_set = set()
        for row in rows:
            asin = row.get('asin')
            if asin and asin not in asin_set:
                asin_set.add(asin)
                asin_list.append(asin)

        if not asin_list:
            raise ValueError("No ASINs found in file. EAN-only lookup is not yet supported.")

        # 4. SellerAmp batch lookup
        print(f"  [3] SellerAmp lookup: {len(asin_list)} ASINs on {country['name']}...")
        sas_data = await sas.lookup_asins(asin_list, keepa_mp)

        # 5. Calculate profit/ROI for each row
        print(f"  [4] Calculating profit/ROI...")
        all_results = []
        for row in rows:
            asin = row.get('asin')
            if not asin or asin not in sas_data:
                continue

            product = sas_data[asin]
            buy_price = row['price']

            analysis = analyze_product(product, buy_price, country_code)
            analysis['asin'] = asin
            analysis['ean'] = row.get('ean')
            analysis['product_name'] = row.get('name') or product.get('category', '')
            analysis['buy_price'] = buy_price
            analysis['amazon_url'] = analysis['amazon_url'] + asin
            all_results.append(analysis)

        # 6. Apply user filters
        print(f"  [5] Applying filters...")
        filtered = apply_filters(all_results, filters)
        print(f"      {len(filtered)}/{len(all_results)} products passed filters")

        # 7. Insert results in batches
        if filtered:
            print(f"  [6] Inserting {len(filtered)} results...")
            batch_size = 500
            for i in range(0, len(filtered), batch_size):
                batch = filtered[i:i+batch_size]
                sb.rpc('analysis_insert_results', {
                    'p_secret': WORKER_SECRET,
                    'p_analysis_id': job_id,
                    'p_results': batch,
                }).execute()

        # 8. Mark completed
        duration_ms = int((time.time() - t0) * 1000)
        sb.rpc('analysis_complete', {
            'p_secret': WORKER_SECRET,
            'p_id': job_id,
            'p_count': len(filtered),
            'p_total': total_rows,
            'p_mapping': column_mapping,
            'p_duration_ms': duration_ms,
        }).execute()

        print(f"  [OK] Completed in {duration_ms/1000:.1f}s — {len(filtered)} results")

    except Exception as e:
        print(f"  [ERROR] {e}")
        traceback.print_exc()
        try:
            sb.rpc('analysis_fail', {
                'p_secret': WORKER_SECRET,
                'p_id': job_id,
                'p_error': str(e),
            }).execute()
        except Exception:
            pass


async def main():
    print("=" * 60)
    print("  AMZing Analysis Worker")
    print("=" * 60)

    sb = get_supabase()

    # Login SellerAmp
    sas = SellerAmpClient(SAS_EMAIL, SAS_PASSWORD)
    await sas.start()

    print(f"\n[*] Polling for jobs every {POLL_INTERVAL}s...\n")
    consecutive_errors = 0

    while True:
        try:
            # Poll for next pending job
            result = sb.rpc('analysis_claim_next', {'p_secret': WORKER_SECRET}).execute()
            jobs = result.data or []

            if jobs:
                job = jobs[0]
                print(f"\n[JOB] {job['id']} — {job['file_name']}")
                await process_job(job, sas, sb)
                consecutive_errors = 0
            else:
                await asyncio.sleep(POLL_INTERVAL)
                consecutive_errors = 0

        except Exception as e:
            consecutive_errors += 1
            print(f"[POLL ERROR] {e}")

            if consecutive_errors >= 5:
                print("[!] Too many consecutive errors, reconnecting SellerAmp...")
                try:
                    await sas.close()
                except Exception:
                    pass
                sas = SellerAmpClient(SAS_EMAIL, SAS_PASSWORD)
                await sas.start()
                consecutive_errors = 0

            await asyncio.sleep(POLL_INTERVAL * 2)


if __name__ == '__main__':
    asyncio.run(main())
