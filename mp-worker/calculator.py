"""
Calculator: exact SellerAmp profit/ROI formula.
Extracted from SellerAmp's JS (GetProfit, GetTotalFees, CalculateVatDue, getDigitalServicesFee).

SellerAmp formula:
  DST = (closing + referral + [fba if dst_on_fba]) * dst_pct
  totalFees = closing + referral + dst + fba + prep + inbound
  vatOnSale = sale - sale/(1+vatRate)
  vatOnCost = cost - cost/(1+vatRate)
  vatDue = vatOnSale - vatOnCost - vatOnFees  (vatOnFees=0 unless useAmazonFeeVatRules20240801)
  profit = sale - totalFees - cost - vatOnFees - vatDue
  roi = profit / cost * 100
"""
from config import COUNTRIES, get_fba_fee


def calculate_product(product_data: dict, country_code: str, profile: dict = None) -> dict:
    """Calculate profit/ROI for a single product using SellerAmp's exact formula."""
    country = COUNTRIES[country_code]
    vat_rate = ((profile or {}).get('vat_rate') or country['vat']) - 1  # e.g. 0.20
    dst_pct = country['dst_pct']
    dst_on_fba = country['dst_on_fba']
    eur_rate = country['eur_rate']
    domain = country['domain']
    mp_id = country['mp_id']

    prep_cost = float((profile or {}).get('prep_cost', 0) or 0)
    inbound_cost = float((profile or {}).get('inbound_cost', 0) or 0)

    sell_local = product_data['prix_local']
    sell_eur = sell_local * eur_rate
    ref_pct = product_data['ref_pct']
    closing_local = product_data['closing_local']

    # Referral fee (in sell currency, then convert)
    referral_local = sell_local * ref_pct
    closing_eur = round(closing_local * eur_rate, 2)
    referral_eur = round(referral_local * eur_rate, 2)

    # FBA fee: use fee table with dimensional weight (NOT Keepa's fba_fees_pick_and_pack_fee)
    fba_local = get_fba_fee(
        product_data.get('weight_g', 0),
        product_data.get('height_mm', 0),
        product_data.get('length_mm', 0),
        product_data.get('width_mm', 0),
        country_code,
    )
    # Fallback to Keepa's value if fee table lookup fails
    if fba_local is None:
        fba_local = product_data.get('fba_fee_local')

    fba_eur = round(fba_local * eur_rate, 2) if fba_local is not None else None

    # DST (Digital Services Tax) — SellerAmp formula
    if dst_pct > 0:
        dst_base = closing_eur + referral_eur
        if dst_on_fba and fba_eur is not None:
            dst_base += fba_eur
        dst_eur = dst_base * dst_pct
    else:
        dst_eur = 0

    # Total fees FBA
    total_fees_fba = None
    if fba_eur is not None:
        total_fees_fba = round(closing_eur + referral_eur + dst_eur + fba_eur + prep_cost + inbound_cost, 2)

    # Total fees FBM (no FBA fee, no DST on FBA fee)
    dst_fbm = (closing_eur + referral_eur) * dst_pct if dst_pct > 0 else 0
    total_fees_fbm = round(closing_eur + referral_eur + dst_fbm + prep_cost + inbound_cost, 2)

    # Amazon prices
    amazon_price_eur = None
    if product_data.get('prix_amz_local') is not None:
        amazon_price_eur = round(product_data['prix_amz_local'] * eur_rate, 2)
    fba_price_eur = None
    if product_data.get('prix_fba_local') is not None:
        fba_price_eur = round(product_data['prix_fba_local'] * eur_rate, 2)

    asin = product_data.get('_asin', '')

    return {
        'asin': asin,
        'ean': product_data.get('ean', ''),
        'product_name': product_data.get('title', ''),
        'image_url': product_data.get('image_url'),
        'category': product_data['category'],
        'bsr': product_data['bsr'],
        'sales_monthly': product_data['sales_mo'],
        'sell_price': round(sell_eur, 2),
        'amazon_price': amazon_price_eur,
        'fba_price': fba_price_eur,
        'fba_fee': fba_eur,
        'commission_pct': round(ref_pct * 100, 2),
        'commission_eur': referral_eur,
        'closing_fee': closing_eur,
        'dst_fee': round(dst_eur, 2),
        'total_fees_fba': total_fees_fba,
        'total_fees_fbm': total_fees_fbm,
        'profit_fba': None,
        'roi_fba': None,
        'profit_fbm': None,
        'roi_fbm': None,
        'fba_sellers': product_data['fba_sellers'],
        'fbm_sellers': product_data['fbm_sellers'],
        'variations': product_data['n_variations'],
        'alerts': product_data['alerts'],
        'buy_price': None,
        'country_code': country_code,
        'amazon_url': f'https://www.{domain}/dp/{asin}',
        'keepa_data': product_data.get('keepa_data'),
        'offers': product_data.get('offers', []),
        'weight_g': product_data.get('weight_g', 0),
        'height_mm': product_data.get('height_mm', 0),
        'length_mm': product_data.get('length_mm', 0),
        'width_mm': product_data.get('width_mm', 0),
    }


def calculate_with_buy_price(result: dict, buy_price: float) -> dict:
    """Add profit/ROI to a result given a buy price. Uses exact SellerAmp formula."""
    if buy_price is None or buy_price <= 0:
        return result

    sell = result.get('sell_price', 0)
    vat_rate = 0.20  # Default FR
    country = COUNTRIES.get(result.get('country_code', 'FR'))
    if country:
        vat_rate = country['vat'] - 1

    total_fees_fba = result.get('total_fees_fba')
    total_fees_fbm = result.get('total_fees_fbm', 0)

    # VAT calculation (SellerAmp vat_scheme=3 STANDARD, vat_on_sale=1, vat_on_cost=1)
    vat_on_sale = sell - sell / (1 + vat_rate)
    vat_on_cost = buy_price - buy_price / (1 + vat_rate)
    vat_on_fees = 0  # Only if useAmazonFeeVatRules20240801=1 (which is 0 for our user)
    vat_due = vat_on_sale - vat_on_cost - vat_on_fees

    # FBM profit
    profit_fbm = round(sell - total_fees_fbm - buy_price - vat_on_fees - vat_due, 2)
    roi_fbm = round((profit_fbm / buy_price) * 100, 2) if buy_price > 0 else 0

    result['buy_price'] = buy_price
    result['profit_fbm'] = profit_fbm
    result['roi_fbm'] = roi_fbm

    # FBA profit
    if total_fees_fba is not None:
        profit_fba = round(sell - total_fees_fba - buy_price - vat_on_fees - vat_due, 2)
        roi_fba = round((profit_fba / buy_price) * 100, 2) if buy_price > 0 else 0
        result['profit_fba'] = profit_fba
        result['roi_fba'] = roi_fba

    return result
