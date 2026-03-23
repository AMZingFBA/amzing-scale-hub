"""
Filter engine: applies user-defined filters to analysis results.
"""


def apply_filters(results: list[dict], filters: dict) -> list[dict]:
    """
    Filter a list of product analysis results based on user criteria.
    Each result dict has keys: asin, ean, product_name, buy_price, sell_price,
    profit_fba, roi_fba, profit_fbm, roi_fbm, bsr, sales_monthly,
    fba_sellers, fbm_sellers, category, variations, alerts, ...
    """
    filtered = []
    for r in results:
        if not _passes(r, filters):
            continue
        filtered.append(r)
    return filtered


def _passes(r: dict, f: dict) -> bool:
    """Check if a single result passes all filters."""
    # ROI FBA min
    if f.get('min_roi_fba') is not None and r.get('roi_fba') is not None:
        if r['roi_fba'] < f['min_roi_fba']:
            return False

    # Profit FBA min
    if f.get('min_profit_fba') is not None and r.get('profit_fba') is not None:
        if r['profit_fba'] < f['min_profit_fba']:
            return False

    # ROI FBM min
    if f.get('min_roi_fbm') is not None and r.get('roi_fbm') is not None:
        if r['roi_fbm'] < f['min_roi_fbm']:
            return False

    # Profit FBM min
    if f.get('min_profit_fbm') is not None and r.get('profit_fbm') is not None:
        if r['profit_fbm'] < f['min_profit_fbm']:
            return False

    # Ventes/mois min
    if f.get('min_sales_monthly') is not None:
        if (r.get('sales_monthly') or 0) < f['min_sales_monthly']:
            return False

    # Vendeurs FBA max
    if f.get('max_sellers_fba') is not None:
        if (r.get('fba_sellers') or 0) > f['max_sellers_fba']:
            return False

    # Vendeurs FBM max
    if f.get('max_sellers_fbm') is not None:
        if (r.get('fbm_sellers') or 0) > f['max_sellers_fbm']:
            return False

    # BSR range
    if f.get('max_bsr') is not None:
        bsr = r.get('bsr') or 0
        if bsr > f['max_bsr'] or bsr <= 0:
            return False

    if f.get('min_bsr') is not None:
        bsr = r.get('bsr') or 0
        if bsr < f['min_bsr']:
            return False

    # Alertes à exclure
    exclude_alerts = f.get('exclude_alerts') or []
    if exclude_alerts and r.get('alerts'):
        product_alerts = [a.strip() for a in r['alerts'].split(',')]
        for alert in exclude_alerts:
            if alert in product_alerts:
                return False

    # Variations max
    if f.get('max_variations') is not None:
        if (r.get('variations') or 0) > f['max_variations']:
            return False

    # Prix vente range
    if f.get('min_sell_price') is not None and r.get('sell_price') is not None:
        if r['sell_price'] < f['min_sell_price']:
            return False

    if f.get('max_sell_price') is not None and r.get('sell_price') is not None:
        if r['sell_price'] > f['max_sell_price']:
            return False

    return True


def get_default_filters() -> dict:
    """Returns the default filter template with all fields set to None (no filtering)."""
    return {
        'country': 'FR',
        'min_roi_fba': None,
        'min_profit_fba': None,
        'min_roi_fbm': None,
        'min_profit_fbm': None,
        'min_sales_monthly': None,
        'max_sellers_fba': None,
        'max_sellers_fbm': None,
        'min_bsr': None,
        'max_bsr': None,
        'exclude_alerts': [],
        'max_variations': None,
        'min_sell_price': None,
        'max_sell_price': None,
    }
