#!/usr/bin/env python3
"""
AMZing MP Worker: polls Supabase for pending product lookup jobs,
processes them via SellerAmp API, calculates profit/ROI, stores results.
Runs 24/7 on Hetzner server.
"""
import asyncio
import os
import time
import traceback

from dotenv import load_dotenv
from supabase import create_client

from config import COUNTRIES, POLL_INTERVAL
from selleramp import SellerAmpClient
from calculator import calculate_product, calculate_with_buy_price

load_dotenv()

SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_KEY']
WORKER_SECRET = os.environ['WORKER_SECRET']
SAS_EMAIL = os.environ['SAS_EMAIL']
SAS_PASSWORD = os.environ['SAS_PASSWORD']


def get_supabase():
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def parse_query_input(query_input: str) -> list[str]:
    """Parse query input into a list of ASINs/EANs."""
    items = []
    for item in query_input.replace('\n', ',').split(','):
        item = item.strip().upper()
        if item:
            items.append(item)
    return items


async def process_job(job: dict, sas: SellerAmpClient, sb):
    """Process a single lookup job."""
    job_id = job['id']
    user_id = job['user_id']
    t0 = time.time()

    try:
        country_code = job.get('country_code', 'FR')
        if country_code not in COUNTRIES:
            raise ValueError(f"Unknown country: {country_code}")

        country = COUNTRIES[country_code]
        keepa_mp = country['keepa_mp']

        # 1. Parse query input
        items = parse_query_input(job['query_input'])
        if not items:
            raise ValueError("No valid ASINs/EANs in query input")

        print(f"  [1] Looking up {len(items)} item(s) on {country['name']}...")

        # 2. Check cache for each ASIN
        cached = {}
        to_fetch = []
        for asin in items:
            try:
                result = sb.rpc('mp_get_cache', {
                    'p_secret': WORKER_SECRET,
                    'p_asin': asin,
                    'p_country_code': country_code,
                    'p_max_age_hours': 24,
                }).execute()
                if result.data:
                    cached[asin] = result.data
                else:
                    to_fetch.append(asin)
            except Exception:
                to_fetch.append(asin)

        print(f"  [2] Cache: {len(cached)} hit, {len(to_fetch)} to fetch")

        # 3. Fetch missing from SellerAmp
        fetched = {}
        if to_fetch:
            fetched = await sas.lookup_asins(to_fetch, keepa_mp)

            # Store in cache
            for asin, data in fetched.items():
                try:
                    sb.rpc('mp_upsert_cache', {
                        'p_secret': WORKER_SECRET,
                        'p_asin': asin,
                        'p_country_code': country_code,
                        'p_raw_data': data,
                    }).execute()
                except Exception as e:
                    print(f"  [WARN] Cache upsert failed for {asin}: {e}")

        # 4. Merge cached + freshly fetched
        all_data = {**cached, **fetched}

        # 5. Load user profile if specified
        profile = None
        if job.get('profile_id'):
            try:
                prof_result = sb.table('mp_settings_profiles').select('*').eq('id', job['profile_id']).single().execute()
                if prof_result.data:
                    profile = prof_result.data
            except Exception:
                pass

        # 6. Calculate for each ASIN
        print(f"  [3] Calculating profit/ROI for {len(all_data)} products...")
        results = []
        for asin, product_data in all_data.items():
            product_data['_asin'] = asin
            result = calculate_product(product_data, country_code, profile)
            result['user_id'] = user_id

            # Remove internal fields before storing
            for k in list(result.keys()):
                if k.startswith('_'):
                    del result[k]

            results.append(result)

        # 7. Insert results via RPC
        if results:
            print(f"  [4] Inserting {len(results)} results...")
            duration_ms = int((time.time() - t0) * 1000)
            sb.rpc('mp_complete', {
                'p_secret': WORKER_SECRET,
                'p_id': job_id,
                'p_results': results,
                'p_processing_ms': duration_ms,
            }).execute()
        else:
            # No results found
            duration_ms = int((time.time() - t0) * 1000)
            sb.rpc('mp_complete', {
                'p_secret': WORKER_SECRET,
                'p_id': job_id,
                'p_results': [],
                'p_processing_ms': duration_ms,
            }).execute()

        print(f"  [OK] Completed in {duration_ms/1000:.1f}s — {len(results)} results")

    except Exception as e:
        print(f"  [ERROR] {e}")
        traceback.print_exc()
        try:
            sb.rpc('mp_fail', {
                'p_secret': WORKER_SECRET,
                'p_id': job_id,
                'p_error': str(e),
            }).execute()
        except Exception:
            pass


async def main():
    print("=" * 60)
    print("  AMZing MP Worker")
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
            result = sb.rpc('mp_claim_next', {'p_secret': WORKER_SECRET}).execute()
            jobs = result.data or []

            if jobs:
                job = jobs[0]
                print(f"\n[JOB] {job['id']} — {job['query_input'][:50]}")
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
