"""
SellerAmp API client: login + batch ASIN lookup.
Extracted from analyze_products.py (Veepee project).
"""
import asyncio
import json
import re
import aiohttp
from config import BATCH_SIZE, CONCURRENCY

SAS_BASE = "https://sas.selleramp.com"


class SellerAmpClient:
    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password
        self.session = None
        self.uid = None
        self.token = None
        self.csrf = None

    async def start(self):
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        self.session = aiohttp.ClientSession(headers=headers)
        await self._login()

    async def close(self):
        if self.session:
            await self.session.close()

    async def _login(self):
        async with self.session.get(f"{SAS_BASE}/site/login") as resp:
            html = await resp.text()
        csrf = re.search(r'name="csrf-token"\s+content="([^"]+)"', html).group(1)
        data = {
            '_csrf-sasend': csrf,
            'LoginForm[email]': self.email,
            'LoginForm[password]': self.password,
            'LoginForm[rememberMe]': '1',
        }
        async with self.session.post(f"{SAS_BASE}/site/login", data=data, allow_redirects=True) as resp:
            html = await resp.text()
        self.uid = int(re.search(r'"id":(\d+)', html).group(1))
        self.token = re.search(r'"api_token":"([^"]+)"', html).group(1)
        self.csrf = re.search(r'name="csrf-token"\s+content="([^"]+)"', html).group(1)
        print(f"[SellerAmp] Logged in (user {self.uid})")

    async def lookup_batch(self, asins: list[str], keepa_mp: int) -> dict:
        """Lookup a batch of ASINs on a specific marketplace. Returns dict[asin -> data]."""
        payload = {
            "u": self.uid, "api_token": self.token, "asin": asins[0], "sl_asin": "",
            "action": 506, "slid": 0,
            "payload": {"keepa_mp_id": keepa_mp, "asin_list": asins}
        }
        headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-Token': self.csrf,
            'Referer': f'{SAS_BASE}/sas/lookup',
        }
        for attempt in range(2):
            try:
                async with self.session.post(
                    f"{SAS_BASE}/api/do", data={"data": json.dumps(payload)},
                    headers=headers, timeout=aiohttp.ClientTimeout(total=60)
                ) as resp:
                    result = await resp.json(content_type=None)
                break
            except Exception:
                if attempt == 1:
                    return {}
                await asyncio.sleep(2)

        data_map = {}
        for asin in asins:
            kpl = result.get('kpls', {}).get(asin, {})
            if not isinstance(kpl, dict):
                continue

            cur = kpl.get('current', {})
            prix_new = int(cur.get('18', '-1'))
            prix_amz = int(cur.get('0', '-1'))
            prix_fba = int(cur.get('7', '-1'))
            prix = -1
            for p in [prix_new, prix_amz, prix_fba]:
                if p > 0:
                    if prix < 0 or p < prix:
                        prix = p
            if prix <= 0:
                continue

            fba_fee_raw = kpl.get('fba_fees_pick_and_pack_fee')
            fba_fee = fba_fee_raw / 100 if fba_fee_raw and fba_fee_raw > 0 else None

            ref_rule = kpl.get('referral_fee_rule', '1,0.15')
            try:
                ref_pct = float(ref_rule.split(',')[1])
            except Exception:
                ref_pct = 0.15
            closing = float(kpl.get('closing_fee', '0') or '0')

            bsr = int(cur.get('3', '0'))
            est = kpl.get('estimated_sales', {})
            sales_mo = est.get('monthly', 0) if isinstance(est, dict) else 0

            fba_sellers = kpl.get('stats_offer_count_fba', 0) or 0
            fbm_sellers = kpl.get('stats_offer_count_fbm', 0) or 0
            cat = kpl.get('category_name', '')

            variations = kpl.get('variations', [])
            n_variations = len(variations) if isinstance(variations, list) else 0

            alerts = []
            if kpl.get('private_label'): alerts.append('PL')
            if kpl.get('ip_issue'): alerts.append('IP')
            if kpl.get('containsHazardousMaterials'): alerts.append('Hazmat')
            if kpl.get('containsLithiumBattery'): alerts.append('Lithium')
            if kpl.get('meltable'): alerts.append('Meltable')
            if kpl.get('oversize'): alerts.append('Oversize')

            data_map[asin] = {
                'prix_local': prix / 100,
                'ref_pct': ref_pct,
                'fba_fee_local': fba_fee,
                'closing_local': closing,
                'bsr': bsr,
                'sales_mo': sales_mo,
                'fba_sellers': fba_sellers,
                'fbm_sellers': fbm_sellers,
                'category': cat,
                'n_variations': n_variations,
                'alerts': ', '.join(alerts) if alerts else '',
                'weight_g': kpl.get('package_weight', 0) or 0,
                'height_mm': kpl.get('package_height', 0) or 0,
                'length_mm': kpl.get('package_length', 0) or 0,
                'width_mm': kpl.get('package_width', 0) or 0,
            }
        return data_map

    async def lookup_asins(self, asin_list: list[str], keepa_mp: int) -> dict:
        """Lookup all ASINs with concurrency control. Returns merged dict[asin -> data]."""
        sem = asyncio.Semaphore(CONCURRENCY)
        all_data = {}
        counter = [0]
        total = len(asin_list)

        async def process(batch):
            async with sem:
                result = await self.lookup_batch(batch, keepa_mp)
                all_data.update(result)
                counter[0] += len(batch)
                print(f"\r    {counter[0]}/{total} ({counter[0]*100//total}%) | Found: {len(all_data)}", end='', flush=True)

        batches = [asin_list[i:i+BATCH_SIZE] for i in range(0, total, BATCH_SIZE)]
        await asyncio.gather(*[process(b) for b in batches])
        print(f"\n    {len(all_data)} products found")
        return all_data
