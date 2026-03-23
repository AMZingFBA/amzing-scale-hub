"""
Configuration: countries, VAT, EFN fees, SellerAmp constants.
Shared by all worker modules.
"""

GBP_EUR = 1.158  # Amazon internal GBP→EUR rate

COUNTRIES = {
    'FR': {'name': 'France',    'keepa_mp': 4, 'vat': 1.20, 'dst_pct': 0.03, 'domain': 'amazon.fr',    'eur_rate': 1.0,     'symbol': '€'},
    'UK': {'name': 'UK',        'keepa_mp': 2, 'vat': 1.20, 'dst_pct': 0.03, 'domain': 'amazon.co.uk', 'eur_rate': GBP_EUR, 'symbol': '£'},
    'DE': {'name': 'Allemagne', 'keepa_mp': 3, 'vat': 1.19, 'dst_pct': 0.03, 'domain': 'amazon.de',    'eur_rate': 1.0,     'symbol': '€'},
    'ES': {'name': 'Espagne',   'keepa_mp': 9, 'vat': 1.21, 'dst_pct': 0.03, 'domain': 'amazon.es',    'eur_rate': 1.0,     'symbol': '€'},
    'IT': {'name': 'Italie',    'keepa_mp': 8, 'vat': 1.22, 'dst_pct': 0.03, 'domain': 'amazon.it',    'eur_rate': 1.0,     'symbol': '€'},
}

BATCH_SIZE = 100
CONCURRENCY = 10
POLL_INTERVAL = 8  # seconds

# EFN fee table: (max_weight_kg, max_dim1_cm, max_dim2_cm, max_dim3_cm, efn_fr_to_uk_GBP, efn_eu_EUR)
# Source: SellerAmp JS (gAmzFbaFeesTbl) — standard fees
EFN_FEE_TABLE = [
    (0.02,  33,  23,  2.5,  3.33,  5.08),
    (0.04,  33,  23,  2.5,  3.35,  5.11),
    (0.06,  33,  23,  2.5,  3.39,  5.16),
    (0.08,  33,  23,  2.5,  3.43,  5.47),
    (0.10,  33,  23,  2.5,  3.47,  5.50),
    (0.21,  33,  23,  2.5,  3.47,  5.50),
    (0.46,  33,  23,  2.5,  3.56,  5.53),
    (0.96,  33,  23,  4.0,  3.73,  6.09),
    (0.96,  33,  23,  6.0,  3.80,  6.72),
    (0.15,  35,  25, 12.0,  3.88,  6.61),
    (0.40,  35,  25, 12.0,  3.97,  7.05),
    (0.90,  35,  25, 12.0,  4.13,  8.45),
    (1.40,  35,  25, 12.0,  4.35,  9.28),
    (1.90,  35,  25, 12.0,  4.77, 10.58),
    (3.90,  35,  25, 12.0,  4.87, 13.42),
    (0.15,  45,  34, 26.0,  4.24,  6.63),
    (0.40,  45,  34, 26.0,  4.45,  7.73),
    (0.90,  45,  34, 26.0,  4.64,  9.19),
    (1.40,  45,  34, 26.0,  4.71, 10.43),
    (1.90,  45,  34, 26.0,  5.13, 11.97),
    (2.90,  45,  34, 26.0,  6.20, 13.42),
    (3.90,  45,  34, 26.0,  7.82, 15.80),
    (5.90,  45,  34, 26.0,  8.62, 16.67),
    (8.90,  45,  34, 26.0,  8.78, 18.06),
   (11.90,  45,  34, 26.0,  9.24, 21.24),
    (1.76,  61,  46, 46.0,  9.86, 15.24),
   (15.00, 101,  60, 60.0, 10.05, 18.57),
   (23.00, 101,  60, 60.0, 16.43, 28.33),
   (23.00, 120,  60, 60.0, 10.45, 19.07),
   (23.00, 9999, 9999, 9999, 12.45, 28.40),
   (31.50, 9999, 9999, 9999, 17.90, 37.67),
]


def get_efn_fee(weight_g, height_mm, length_mm, width_mm, country_code):
    """Lookup EFN fee based on product dimensions/weight.
    Returns fee in local currency (GBP for UK, EUR for DE/ES/IT) or None."""
    w_kg = (weight_g or 0) / 1000
    dims_cm = sorted([(length_mm or 0) / 10, (width_mm or 0) / 10, (height_mm or 0) / 10], reverse=True)
    d1, d2, d3 = dims_cm

    for max_w, max_d1, max_d2, max_d3, efn_uk, efn_eu in EFN_FEE_TABLE:
        if w_kg <= max_w and d1 <= max_d1 and d2 <= max_d2 and d3 <= max_d3:
            if country_code == 'UK':
                return efn_uk if efn_uk > 0 else None
            else:
                return efn_eu if efn_eu > 0 else None
    return None
