"""
Calculator: computes profit/ROI for a product given user profile settings.
Uses the verified formula from analyze_products.py with added prep/inbound costs.
"""
from config import COUNTRIES, get_efn_fee


def calculate_product(product_data: dict, country_code: str, profile: dict = None) -> dict:
    """
    Calculate profit and ROI for a single product.

    Args:
        product_data: dict from SellerAmp lookup (prix_local, ref_pct, fba_fee_local, etc.)
        country_code: FR, UK, DE, ES, IT
        profile: optional user profile dict with prep_cost, inbound_cost, vat_rate overrides

    Returns:
        dict with all calculated fields ready for mp_lookup_results insertion.
    """
    country = COUNTRIES[country_code]
    vat = (profile or {}).get('vat_rate') or country['vat']
    dst_pct = country['dst_pct']
    eur_rate = country['eur_rate']
    domain = country['domain']

    prep_cost = float((profile or {}).get('prep_cost', 0) or 0)
    inbound_cost = float((profile or {}).get('inbound_cost', 0) or 0)

    prix_local = product_data['prix_local']
    sell_eur = prix_local * eur_rate

    ref_pct = product_data['ref_pct']
    closing_local = product_data['closing_local']
    fba_local = product_data['fba_fee_local']

    # Fees in EUR
    closing_eur = round(closing_local * eur_rate, 2)
    comm_dst_eur = round(sell_eur * ref_pct * (1 + dst_pct), 2)
    commission_eur = round(sell_eur * ref_pct, 2)

    # Amazon price and FBA price in EUR
    amazon_price_eur = None
    if product_data.get('prix_amz_local') is not None:
        amazon_price_eur = round(product_data['prix_amz_local'] * eur_rate, 2)

    fba_price_eur = None
    if product_data.get('prix_fba_local') is not None:
        fba_price_eur = round(product_data['prix_fba_local'] * eur_rate, 2)

    # FBM profit (no buy price — show profit per euro of buy price)
    # For MP, we calculate based on sell_eur only (buy_price = 0 means "not specified")
    fees_fbm = comm_dst_eur + closing_eur + prep_cost + inbound_cost

    # FBA fee: use EFN for UK (verified accurate), local fee for FR/DE/ES/IT
    fba_eur = None
    if country_code == 'UK' and product_data.get('weight_g'):
        efn_fee = get_efn_fee(
            product_data['weight_g'], product_data['height_mm'],
            product_data['length_mm'], product_data['width_mm'], 'UK'
        )
        if efn_fee is not None:
            fba_eur = round(efn_fee * eur_rate, 2)

    if fba_eur is None and fba_local is not None:
        fba_eur = round(fba_local * eur_rate, 2)

    profit_fba = None
    roi_fba = None
    fees_fba = None
    if fba_eur is not None:
        fba_dst_eur = round(fba_eur * dst_pct, 2)
        fees_fba = comm_dst_eur + fba_eur + fba_dst_eur + closing_eur + prep_cost + inbound_cost

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
        'commission_eur': commission_eur,
        'closing_fee': closing_eur,
        'profit_fba': None,  # calculated per buy_price on frontend or when buy_price is set
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
        # Internal: fee breakdowns for frontend profit calculation
        '_fees_fbm': fees_fbm,
        '_fees_fba': fees_fba,
        '_vat': vat,
        '_sell_eur': round(sell_eur, 2),
    }


def calculate_with_buy_price(result: dict, buy_price: float) -> dict:
    """
    Add profit/ROI calculations to a result dict given a buy price.
    Modifies and returns the same dict.
    """
    if buy_price is None or buy_price <= 0:
        return result

    vat = result.get('_vat', 1.20)
    sell_eur = result.get('_sell_eur', result.get('sell_price', 0))
    fees_fbm = result.get('_fees_fbm', 0)
    fees_fba = result.get('_fees_fba')

    marge_ht = (sell_eur - buy_price) / vat

    # FBM
    profit_fbm = round(marge_ht - fees_fbm, 2)
    roi_fbm = round((profit_fbm / buy_price) * 100, 2) if buy_price > 0 else 0

    result['buy_price'] = buy_price
    result['profit_fbm'] = profit_fbm
    result['roi_fbm'] = roi_fbm

    # FBA
    if fees_fba is not None:
        profit_fba = round(marge_ht - fees_fba, 2)
        roi_fba = round((profit_fba / buy_price) * 100, 2) if buy_price > 0 else 0
        result['profit_fba'] = profit_fba
        result['roi_fba'] = roi_fba

    return result
