"""
Analyzer: calculates profit/ROI for each product.
Uses the verified formula from analyze_products.py.
"""
from config import COUNTRIES, get_efn_fee


def analyze_product(product_data: dict, buy_price: float, country_code: str) -> dict:
    """
    Calculate profit and ROI for a single product.

    Args:
        product_data: dict from SellerAmp lookup (prix_local, ref_pct, fba_fee_local, etc.)
        buy_price: purchase price in EUR (TTC)
        country_code: FR, UK, DE, ES, IT

    Returns:
        dict with sell_price, profit_fba, roi_fba, profit_fbm, roi_fbm, etc.
        All values in EUR.
    """
    country = COUNTRIES[country_code]
    vat = country['vat']
    dst_pct = country['dst_pct']
    eur_rate = country['eur_rate']
    domain = country['domain']

    prix_local = product_data['prix_local']
    sell_eur = prix_local * eur_rate

    ref_pct = product_data['ref_pct']
    closing_local = product_data['closing_local']
    fba_local = product_data['fba_fee_local']

    # Fees in EUR
    closing_eur = round(closing_local * eur_rate, 2)
    comm_dst_eur = round(sell_eur * ref_pct * (1 + dst_pct), 2)
    commission_eur = round(sell_eur * ref_pct, 2)

    # Margin HT = (sell EUR - buy EUR) / VAT
    marge_ht = (sell_eur - buy_price) / vat

    # FBM: commission+DST + closing
    fees_fbm = comm_dst_eur + closing_eur
    profit_fbm = round(marge_ht - fees_fbm, 2)
    roi_fbm = round((profit_fbm / buy_price) * 100, 2) if buy_price > 0 else 0

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
    if fba_eur is not None:
        fba_dst_eur = round(fba_eur * dst_pct, 2)
        fees_fba = comm_dst_eur + fba_eur + fba_dst_eur + closing_eur
        profit_fba = round(marge_ht - fees_fba, 2)
        roi_fba = round((profit_fba / buy_price) * 100, 2) if buy_price > 0 else 0

    return {
        'sell_price': round(sell_eur, 2),
        'profit_fba': profit_fba,
        'roi_fba': roi_fba,
        'profit_fbm': profit_fbm,
        'roi_fbm': roi_fbm,
        'bsr': product_data['bsr'],
        'sales_monthly': product_data['sales_mo'],
        'fba_sellers': product_data['fba_sellers'],
        'fbm_sellers': product_data['fbm_sellers'],
        'category': product_data['category'],
        'variations': product_data['n_variations'],
        'alerts': product_data['alerts'],
        'commission_pct': round(ref_pct * 100, 2),
        'fba_fee': fba_eur,
        'country_code': country_code,
        'amazon_url': f'https://www.{domain}/dp/',  # ASIN appended by caller
    }
