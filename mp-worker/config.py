"""
Configuration: countries, FBA fee table, DST, SellerAmp constants.
Shared by all mp-worker modules.
Fee table extracted from SellerAmp JS (gAmzFbaFeesTbl).
"""

GBP_EUR = 1.158  # Amazon internal GBP->EUR rate

COUNTRIES = {
    'FR': {
        'name': 'France', 'keepa_mp': 4, 'vat': 1.20, 'domain': 'amazon.fr',
        'eur_rate': 1.0, 'symbol': '€', 'mp_id': 'fr',
        'dst_pct': 0.03, 'dst_on_fba': True,
    },
    'UK': {
        'name': 'UK', 'keepa_mp': 2, 'vat': 1.20, 'domain': 'amazon.co.uk',
        'eur_rate': GBP_EUR, 'symbol': '£', 'mp_id': 'uk',
        'dst_pct': 0.02, 'dst_on_fba': True,
    },
    'DE': {
        'name': 'Allemagne', 'keepa_mp': 3, 'vat': 1.19, 'domain': 'amazon.de',
        'eur_rate': 1.0, 'symbol': '€', 'mp_id': 'de',
        'dst_pct': 0.0, 'dst_on_fba': False,
    },
    'ES': {
        'name': 'Espagne', 'keepa_mp': 9, 'vat': 1.21, 'domain': 'amazon.es',
        'eur_rate': 1.0, 'symbol': '€', 'mp_id': 'es',
        'dst_pct': 0.03, 'dst_on_fba': False,
    },
    'IT': {
        'name': 'Italie', 'keepa_mp': 8, 'vat': 1.22, 'domain': 'amazon.it',
        'eur_rate': 1.0, 'symbol': '€', 'mp_id': 'it',
        'dst_pct': 0.03, 'dst_on_fba': False,
    },
}

BATCH_SIZE = 100
CONCURRENCY = 10
POLL_INTERVAL = 3

# Full SellerAmp FBA Fee Table (gAmzFbaFeesTbl) — 48 normal + 12 low-price tiers
# Each tier: desc, max_w(kg), max_dw(kg), use_dim_weight, dims(cm), local fees per marketplace, EFN fees
# Tiers 0-39: normal fees, Tiers 40-51: low-price fees
FBA_FEE_TABLE = [
    {"desc": "Light Envelope", "max_w": 0.02, "max_dw": 0.02, "use_dw": 0, "d1": 33, "d2": 23, "d3": 2.5, "oversize": 0, "local_fr": 2.75, "local_uk": 1.83, "local_de": 2.07, "local_es": 2.77, "local_it": 3.23, "efn_fr": 5.08, "efn_de": 5.08, "efn_it": 5.08, "efn_es": 5.08, "efn_fr_to_uk": 3.33, "efn_de_to_uk": 3.33, "efn_uk_to_fr": 4.2, "efn_uk_to_de": 4.2, "efn_uk_to_it": 4.2, "efn_uk_to_es": 4.2, "low_price_fba": 0},
    {"desc": "Light Envelope", "max_w": 0.04, "max_dw": 0.04, "use_dw": 0, "d1": 33, "d2": 23, "d3": 2.5, "oversize": 0, "local_fr": 2.76, "local_uk": 1.87, "local_de": 2.11, "local_es": 2.84, "local_it": 3.26, "efn_fr": 5.11, "efn_de": 5.11, "efn_it": 5.11, "efn_es": 5.11, "efn_fr_to_uk": 3.35, "efn_de_to_uk": 3.35, "efn_uk_to_fr": 4.23, "efn_uk_to_de": 4.23, "efn_uk_to_it": 4.23, "efn_uk_to_es": 4.23, "low_price_fba": 0},
    {"desc": "Light Envelope", "max_w": 0.06, "max_dw": 0.06, "use_dw": 0, "d1": 33, "d2": 23, "d3": 2.5, "oversize": 0, "local_fr": 2.78, "local_uk": 1.89, "local_de": 2.13, "local_es": 2.87, "local_it": 3.28, "efn_fr": 5.16, "efn_de": 5.16, "efn_it": 5.16, "efn_es": 5.16, "efn_fr_to_uk": 3.39, "efn_de_to_uk": 3.39, "efn_uk_to_fr": 4.26, "efn_uk_to_de": 4.26, "efn_uk_to_it": 4.26, "efn_uk_to_es": 4.26, "low_price_fba": 0},
    {"desc": "Light Envelope", "max_w": 0.08, "max_dw": 0.08, "use_dw": 0, "d1": 33, "d2": 23, "d3": 2.5, "oversize": 0, "local_fr": 3.3, "local_uk": 2.07, "local_de": 2.26, "local_es": 3.21, "local_it": 3.39, "efn_fr": 5.47, "efn_de": 5.47, "efn_it": 5.47, "efn_es": 5.47, "efn_fr_to_uk": 3.43, "efn_de_to_uk": 3.43, "efn_uk_to_fr": 4.5, "efn_uk_to_de": 4.5, "efn_uk_to_it": 4.5, "efn_uk_to_es": 4.5, "low_price_fba": 0},
    {"desc": "Light Envelope", "max_w": 0.1, "max_dw": 0.1, "use_dw": 0, "d1": 33, "d2": 23, "d3": 2.5, "oversize": 0, "local_fr": 3.32, "local_uk": 2.08, "local_de": 2.28, "local_es": 3.23, "local_it": 3.41, "efn_fr": 5.5, "efn_de": 5.5, "efn_it": 5.5, "efn_es": 5.5, "efn_fr_to_uk": 3.47, "efn_de_to_uk": 3.47, "efn_uk_to_fr": 4.53, "efn_uk_to_de": 4.53, "efn_uk_to_it": 4.53, "efn_uk_to_es": 4.53, "low_price_fba": 0},
    {"desc": "Standard envelope", "max_w": 0.21, "max_dw": 0.21, "use_dw": 0, "d1": 33, "d2": 23, "d3": 2.5, "oversize": 0, "local_fr": 3.33, "local_uk": 2.1, "local_de": 2.31, "local_es": 3.26, "local_it": 3.45, "efn_fr": 5.5, "efn_de": 5.5, "efn_it": 5.5, "efn_es": 5.5, "efn_fr_to_uk": 3.47, "efn_de_to_uk": 3.47, "efn_uk_to_fr": 4.53, "efn_uk_to_de": 4.53, "efn_uk_to_it": 4.53, "efn_uk_to_es": 4.53, "low_price_fba": 0},
    {"desc": "Standard envelope", "max_w": 0.46, "max_dw": 0.46, "use_dw": 0, "d1": 33, "d2": 23, "d3": 2.5, "oversize": 0, "local_fr": 3.77, "local_uk": 2.16, "local_de": 2.42, "local_es": 3.45, "local_it": 3.64, "efn_fr": 5.53, "efn_de": 5.53, "efn_it": 5.53, "efn_es": 5.53, "efn_fr_to_uk": 3.56, "efn_de_to_uk": 3.56, "efn_uk_to_fr": 4.56, "efn_uk_to_de": 4.56, "efn_uk_to_it": 4.56, "efn_uk_to_es": 4.56, "low_price_fba": 0},
    {"desc": "Large envelope", "max_w": 0.96, "max_dw": 0.96, "use_dw": 0, "d1": 33, "d2": 23, "d3": 4, "oversize": 0, "local_fr": 4.39, "local_uk": 2.72, "local_de": 2.78, "local_es": 3.6, "local_it": 3.94, "efn_fr": 6.09, "efn_de": 6.09, "efn_it": 6.09, "efn_es": 6.09, "efn_fr_to_uk": 3.73, "efn_de_to_uk": 3.73, "efn_uk_to_fr": 5.02, "efn_uk_to_de": 5.02, "efn_uk_to_it": 5.02, "efn_uk_to_es": 5.02, "low_price_fba": 0},
    {"desc": "Extra large envelope", "max_w": 0.96, "max_dw": 0.96, "use_dw": 0, "d1": 33, "d2": 23, "d3": 6, "oversize": 0, "local_fr": 4.72, "local_uk": 2.94, "local_de": 3.16, "local_es": 3.85, "local_it": 4.17, "efn_fr": 6.72, "efn_de": 6.72, "efn_it": 6.72, "efn_es": 6.72, "efn_fr_to_uk": 3.8, "efn_de_to_uk": 3.8, "efn_uk_to_fr": 5.54, "efn_uk_to_de": 5.54, "efn_uk_to_it": 5.54, "efn_uk_to_es": 5.54, "low_price_fba": 0},
    {"desc": "Small parcel", "max_w": 0.15, "max_dw": 0.15, "use_dw": 1, "d1": 35, "d2": 25, "d3": 12, "oversize": 0, "local_fr": 4.56, "local_uk": 2.91, "local_de": 3.12, "local_es": 3.52, "local_it": 4.13, "efn_fr": 6.61, "efn_de": 6.61, "efn_it": 6.61, "efn_es": 6.61, "efn_fr_to_uk": 3.88, "efn_de_to_uk": 3.88, "efn_uk_to_fr": 5.45, "efn_uk_to_de": 5.45, "efn_uk_to_it": 5.45, "efn_uk_to_es": 5.45, "low_price_fba": 0},
    {"desc": "Small parcel", "max_w": 0.4, "max_dw": 0.4, "use_dw": 1, "d1": 35, "d2": 25, "d3": 12, "oversize": 0, "local_fr": 5.07, "local_uk": 3.0, "local_de": 3.14, "local_es": 3.74, "local_it": 4.54, "efn_fr": 7.05, "efn_de": 7.05, "efn_it": 7.05, "efn_es": 7.05, "efn_fr_to_uk": 3.97, "efn_de_to_uk": 3.97, "efn_uk_to_fr": 5.82, "efn_uk_to_de": 5.82, "efn_uk_to_it": 5.82, "efn_uk_to_es": 5.82, "low_price_fba": 0},
    {"desc": "Small parcel", "max_w": 0.9, "max_dw": 0.9, "use_dw": 1, "d1": 35, "d2": 25, "d3": 12, "oversize": 0, "local_fr": 5.79, "local_uk": 3.04, "local_de": 3.41, "local_es": 3.95, "local_it": 4.95, "efn_fr": 8.45, "efn_de": 8.45, "efn_it": 8.45, "efn_es": 8.45, "efn_fr_to_uk": 4.13, "efn_de_to_uk": 4.13, "efn_uk_to_fr": 6.97, "efn_uk_to_de": 6.97, "efn_uk_to_it": 6.97, "efn_uk_to_es": 6.97, "low_price_fba": 0},
    {"desc": "Small parcel", "max_w": 1.4, "max_dw": 1.4, "use_dw": 1, "d1": 35, "d2": 25, "d3": 12, "oversize": 0, "local_fr": 5.87, "local_uk": 3.05, "local_de": 4.03, "local_es": 4.21, "local_it": 5.51, "efn_fr": 9.28, "efn_de": 9.28, "efn_it": 9.28, "efn_es": 9.28, "efn_fr_to_uk": 4.35, "efn_de_to_uk": 4.35, "efn_uk_to_fr": 7.66, "efn_uk_to_de": 7.66, "efn_uk_to_it": 7.66, "efn_uk_to_es": 7.66, "low_price_fba": 0},
    {"desc": "Small parcel", "max_w": 1.9, "max_dw": 1.9, "use_dw": 1, "d1": 35, "d2": 25, "d3": 12, "oversize": 0, "local_fr": 6.1, "local_uk": 3.25, "local_de": 4.23, "local_es": 4.27, "local_it": 5.81, "efn_fr": 10.58, "efn_de": 10.58, "efn_it": 10.58, "efn_es": 10.58, "efn_fr_to_uk": 4.77, "efn_de_to_uk": 4.77, "efn_uk_to_fr": 8.73, "efn_uk_to_de": 8.73, "efn_uk_to_it": 8.73, "efn_uk_to_es": 8.73, "low_price_fba": 0},
    {"desc": "Small parcel", "max_w": 3.9, "max_dw": 3.9, "use_dw": 1, "d1": 35, "d2": 25, "d3": 12, "oversize": 0, "local_fr": 9.1, "local_uk": 5.1, "local_de": 5.31, "local_es": 5.5, "local_it": 6.93, "efn_fr": 13.42, "efn_de": 13.42, "efn_it": 13.42, "efn_es": 13.42, "efn_fr_to_uk": 4.87, "efn_de_to_uk": 4.87, "efn_uk_to_fr": 11.07, "efn_uk_to_de": 11.07, "efn_uk_to_it": 11.07, "efn_uk_to_es": 11.07, "low_price_fba": 0},
    {"desc": "Standard Parcel", "max_w": 0.15, "max_dw": 0.15, "use_dw": 1, "d1": 45, "d2": 34, "d3": 26, "oversize": 0, "local_fr": 4.58, "local_uk": 2.94, "local_de": 3.13, "local_es": 3.55, "local_it": 4.29, "efn_fr": 6.63, "efn_de": 6.63, "efn_it": 6.63, "efn_es": 6.63, "efn_fr_to_uk": 4.24, "efn_de_to_uk": 4.24, "efn_uk_to_fr": 5.47, "efn_uk_to_de": 5.47, "efn_uk_to_it": 5.47, "efn_uk_to_es": 5.47, "low_price_fba": 0},
    {"desc": "Standard Parcel", "max_w": 0.4, "max_dw": 0.4, "use_dw": 1, "d1": 45, "d2": 34, "d3": 26, "oversize": 0, "local_fr": 5.4, "local_uk": 3.01, "local_de": 3.52, "local_es": 4.05, "local_it": 4.7, "efn_fr": 7.73, "efn_de": 7.73, "efn_it": 7.73, "efn_es": 7.73, "efn_fr_to_uk": 4.45, "efn_de_to_uk": 4.45, "efn_uk_to_fr": 6.38, "efn_uk_to_de": 6.38, "efn_uk_to_it": 6.38, "efn_uk_to_es": 6.38, "low_price_fba": 0},
    {"desc": "Standard Parcel", "max_w": 0.9, "max_dw": 0.9, "use_dw": 1, "d1": 45, "d2": 34, "d3": 26, "oversize": 0, "local_fr": 6.28, "local_uk": 3.06, "local_de": 3.64, "local_es": 4.45, "local_it": 5.15, "efn_fr": 9.19, "efn_de": 9.19, "efn_it": 9.19, "efn_es": 9.19, "efn_fr_to_uk": 4.64, "efn_de_to_uk": 4.64, "efn_uk_to_fr": 7.58, "efn_uk_to_de": 7.58, "efn_uk_to_it": 7.58, "efn_uk_to_es": 7.58, "low_price_fba": 0},
    {"desc": "Standard Parcel", "max_w": 1.4, "max_dw": 1.4, "use_dw": 1, "d1": 45, "d2": 34, "d3": 26, "oversize": 0, "local_fr": 6.41, "local_uk": 3.26, "local_de": 4.28, "local_es": 4.85, "local_it": 5.81, "efn_fr": 10.43, "efn_de": 10.43, "efn_it": 10.43, "efn_es": 10.43, "efn_fr_to_uk": 4.71, "efn_de_to_uk": 4.71, "efn_uk_to_fr": 8.6, "efn_uk_to_de": 8.6, "efn_uk_to_it": 8.6, "efn_uk_to_es": 8.6, "low_price_fba": 0},
    {"desc": "Standard Parcel", "max_w": 1.9, "max_dw": 1.9, "use_dw": 1, "d1": 45, "d2": 34, "d3": 26, "oversize": 0, "local_fr": 6.84, "local_uk": 3.48, "local_de": 4.71, "local_es": 4.94, "local_it": 6.05, "efn_fr": 11.97, "efn_de": 11.97, "efn_it": 11.97, "efn_es": 11.97, "efn_fr_to_uk": 5.13, "efn_de_to_uk": 5.13, "efn_uk_to_fr": 9.88, "efn_uk_to_de": 9.88, "efn_uk_to_it": 9.88, "efn_uk_to_es": 9.88, "low_price_fba": 0},
    {"desc": "Standard Parcel", "max_w": 2.9, "max_dw": 2.9, "use_dw": 1, "d1": 45, "d2": 34, "d3": 26, "oversize": 0, "local_fr": 9.36, "local_uk": 4.73, "local_de": 4.94, "local_es": 4.98, "local_it": 6.71, "efn_fr": 13.42, "efn_de": 13.42, "efn_it": 13.42, "efn_es": 13.42, "efn_fr_to_uk": 6.2, "efn_de_to_uk": 6.2, "efn_uk_to_fr": 11.07, "efn_uk_to_de": 11.07, "efn_uk_to_it": 11.07, "efn_uk_to_es": 11.07, "low_price_fba": 0},
    {"desc": "Standard Parcel", "max_w": 3.9, "max_dw": 3.9, "use_dw": 1, "d1": 45, "d2": 34, "d3": 26, "oversize": 0, "local_fr": 9.55, "local_uk": 5.16, "local_de": 5.41, "local_es": 5.53, "local_it": 6.96, "efn_fr": 15.8, "efn_de": 15.8, "efn_it": 15.8, "efn_es": 15.8, "efn_fr_to_uk": 7.82, "efn_de_to_uk": 7.82, "efn_uk_to_fr": 13.04, "efn_uk_to_de": 13.04, "efn_uk_to_it": 13.04, "efn_uk_to_es": 13.04, "low_price_fba": 0},
    {"desc": "Standard Parcel", "max_w": 5.9, "max_dw": 5.9, "use_dw": 1, "d1": 45, "d2": 34, "d3": 26, "oversize": 0, "local_fr": 9.67, "local_uk": 5.19, "local_de": 5.69, "local_es": 7.02, "local_it": 7.25, "efn_fr": 16.67, "efn_de": 16.67, "efn_it": 16.67, "efn_es": 16.67, "efn_fr_to_uk": 8.62, "efn_de_to_uk": 8.62, "efn_uk_to_fr": 13.75, "efn_uk_to_de": 13.75, "efn_uk_to_it": 13.75, "efn_uk_to_es": 13.75, "low_price_fba": 0},
    {"desc": "Standard Parcel", "max_w": 8.9, "max_dw": 8.9, "use_dw": 1, "d1": 45, "d2": 34, "d3": 26, "oversize": 0, "local_fr": 10.53, "local_uk": 5.57, "local_de": 6.15, "local_es": 7.24, "local_it": 8.04, "efn_fr": 18.06, "efn_de": 18.06, "efn_it": 18.06, "efn_es": 18.06, "efn_fr_to_uk": 8.78, "efn_de_to_uk": 8.78, "efn_uk_to_fr": 14.9, "efn_uk_to_de": 14.9, "efn_uk_to_it": 14.9, "efn_uk_to_es": 14.9, "low_price_fba": 0},
    {"desc": "Standard Parcel", "max_w": 11.9, "max_dw": 11.9, "use_dw": 1, "d1": 45, "d2": 34, "d3": 26, "oversize": 0, "local_fr": 11.03, "local_uk": 5.77, "local_de": 6.39, "local_es": 7.85, "local_it": 8.63, "efn_fr": 21.24, "efn_de": 21.24, "efn_it": 21.24, "efn_es": 21.24, "efn_fr_to_uk": 9.24, "efn_de_to_uk": 9.24, "efn_uk_to_fr": 17.52, "efn_uk_to_de": 17.52, "efn_uk_to_it": 17.52, "efn_uk_to_es": 17.52, "low_price_fba": 0},
    {"desc": "Small oversize", "max_w": 1.76, "max_dw": 25.82, "use_dw": 1, "d1": 61, "d2": 46, "d3": 46, "oversize": 1, "local_fr": 7.23, "local_uk": 3.65, "local_de": 4.53, "local_es": 5.86, "local_it": 7.39, "efn_fr": 15.24, "efn_de": 15.24, "efn_it": 15.24, "efn_es": 15.24, "efn_fr_to_uk": 9.86, "efn_de_to_uk": 9.86, "efn_uk_to_fr": 11.48, "efn_uk_to_de": 11.48, "efn_uk_to_it": 11.48, "efn_uk_to_es": 11.48, "low_price_fba": 0},
    {"desc": "Standard oversize Light", "max_w": 15, "max_dw": 72.72, "use_dw": 1, "d1": 101, "d2": 60, "d3": 60, "oversize": 1, "local_fr": 7.61, "local_uk": 4.67, "local_de": 4.65, "local_es": 6.91, "local_it": 7.78, "efn_fr": 18.57, "efn_de": 18.57, "efn_it": 18.57, "efn_es": 18.57, "efn_fr_to_uk": 10.05, "efn_de_to_uk": 10.05, "efn_uk_to_fr": 13.87, "efn_uk_to_de": 13.87, "efn_uk_to_it": 13.87, "efn_uk_to_es": 13.87, "low_price_fba": 0},
    {"desc": "Standard oversize Heavy", "max_w": 23, "max_dw": 72.72, "use_dw": 1, "d1": 101, "d2": 60, "d3": 60, "oversize": 1, "local_fr": 13, "local_uk": 8.28, "local_de": 8.93, "local_es": 13.5, "local_it": 13.31, "efn_fr": 28.33, "efn_de": 28.33, "efn_it": 28.33, "efn_es": 28.33, "efn_fr_to_uk": 16.43, "efn_de_to_uk": 16.43, "efn_uk_to_fr": 20.67, "efn_uk_to_de": 20.67, "efn_uk_to_it": 20.67, "efn_uk_to_es": 20.67, "low_price_fba": 0},
    {"desc": "Standard oversize Large", "max_w": 23, "max_dw": 86.4, "use_dw": 1, "d1": 120, "d2": 60, "d3": 60, "oversize": 1, "local_fr": 9.07, "local_uk": 6.2, "local_de": 6.41, "local_es": 7.88, "local_it": 9.74, "efn_fr": 19.07, "efn_de": 19.07, "efn_it": 19.07, "efn_es": 19.07, "efn_fr_to_uk": 10.45, "efn_de_to_uk": 10.45, "efn_uk_to_fr": 14.37, "efn_uk_to_de": 14.37, "efn_uk_to_it": 14.37, "efn_uk_to_es": 14.37, "low_price_fba": 0},
    {"desc": "Bulky oversize", "max_w": 23, "max_dw": 126, "use_dw": 1, "d1": 9999, "d2": 9999, "d3": 9999, "oversize": 1, "local_fr": 16.92, "local_uk": 11.53, "local_de": 9.52, "local_es": 11.49, "local_it": 11.13, "efn_fr": 28.4, "efn_de": 28.4, "efn_it": 28.4, "efn_es": 28.4, "efn_fr_to_uk": 12.45, "efn_de_to_uk": 12.45, "efn_uk_to_fr": 21.4, "efn_uk_to_de": 21.4, "efn_uk_to_it": 21.4, "efn_uk_to_es": 21.4, "low_price_fba": 0},
    {"desc": "Heavy oversize", "max_w": 31.5, "max_dw": 31.5, "use_dw": 1, "d1": 9999, "d2": 9999, "d3": 9999, "oversize": 1, "local_fr": 22.02, "local_uk": 13.04, "local_de": 12.74, "local_es": 14, "local_it": 16.85, "efn_fr": 37.67, "efn_de": 37.67, "efn_it": 37.67, "efn_es": 37.67, "efn_fr_to_uk": 17.9, "efn_de_to_uk": 17.9, "efn_uk_to_fr": 24.92, "efn_uk_to_de": 24.92, "efn_uk_to_it": 24.92, "efn_uk_to_es": 24.92, "low_price_fba": 0},
    {"desc": "Heavy oversize", "max_w": 31.5, "max_dw": 126, "use_dw": 1, "d1": 9999, "d2": 9999, "d3": 9999, "oversize": 1, "local_fr": 22.02, "local_uk": 13.04, "local_de": 12.74, "local_es": 14, "local_it": 16.85, "efn_fr": 37.67, "efn_de": 37.67, "efn_it": 37.67, "efn_es": 37.67, "efn_fr_to_uk": 17.9, "efn_de_to_uk": 17.9, "efn_uk_to_fr": 24.92, "efn_uk_to_de": 24.92, "efn_uk_to_it": 24.92, "efn_uk_to_es": 24.92, "low_price_fba": 0},
    {"desc": "Special oversize", "max_w": 30, "max_dw": 30, "use_dw": 0, "d1": 9999, "d2": 9999, "d3": 9999, "oversize": 1, "local_fr": 24.88, "local_uk": 16.22, "local_de": 21.3, "local_es": 19.93, "local_it": 19.91, "efn_fr": -1, "efn_de": -1, "efn_it": -1, "efn_es": -1, "efn_fr_to_uk": -1, "efn_de_to_uk": -1, "efn_uk_to_fr": -1, "efn_uk_to_de": -1, "efn_uk_to_it": -1, "efn_uk_to_es": -1, "low_price_fba": 0},
    {"desc": "Special oversize", "max_w": 40, "max_dw": 40, "use_dw": 0, "d1": 9999, "d2": 9999, "d3": 9999, "oversize": 1, "local_fr": 32.04, "local_uk": 17.24, "local_de": 24.19, "local_es": 20.8, "local_it": 22.11, "efn_fr": -1, "efn_de": -1, "efn_it": -1, "efn_es": -1, "efn_fr_to_uk": -1, "efn_de_to_uk": -1, "efn_uk_to_fr": -1, "efn_uk_to_de": -1, "efn_uk_to_it": -1, "efn_uk_to_es": -1, "low_price_fba": 0},
    {"desc": "Special oversize", "max_w": 50, "max_dw": 50, "use_dw": 0, "d1": 9999, "d2": 9999, "d3": 9999, "oversize": 1, "local_fr": 54.51, "local_uk": 34.38, "local_de": 47.98, "local_es": 34.32, "local_it": 29.53, "efn_fr": -1, "efn_de": -1, "efn_it": -1, "efn_es": -1, "efn_fr_to_uk": -1, "efn_de_to_uk": -1, "efn_uk_to_fr": -1, "efn_uk_to_de": -1, "efn_uk_to_it": -1, "efn_uk_to_es": -1, "low_price_fba": 0},
    {"desc": "Special oversize", "max_w": 60, "max_dw": 60, "use_dw": 0, "d1": 9999, "d2": 9999, "d3": 9999, "oversize": 1, "local_fr": 58.64, "local_uk": 42.04, "local_de": 51.99, "local_es": 36.93, "local_it": 30.11, "efn_fr": -1, "efn_de": -1, "efn_it": -1, "efn_es": -1, "efn_fr_to_uk": -1, "efn_de_to_uk": -1, "efn_uk_to_fr": -1, "efn_uk_to_de": -1, "efn_uk_to_it": -1, "efn_uk_to_es": -1, "low_price_fba": 0},
    {"desc": "Special oversize", "max_w": 9999, "max_dw": 9999, "use_dw": 0, "d1": 9999, "d2": 9999, "d3": 9999, "oversize": 1, "local_fr": 58.64, "local_uk": 42.04, "local_de": 51.99, "local_es": 36.93, "local_it": 30.11, "efn_fr": -1, "efn_de": -1, "efn_it": -1, "efn_es": -1, "efn_fr_to_uk": -1, "efn_de_to_uk": -1, "efn_uk_to_fr": -1, "efn_uk_to_de": -1, "efn_uk_to_it": -1, "efn_uk_to_es": -1, "low_price_fba": 0},
]


def get_fba_fee(weight_g, height_mm, length_mm, width_mm, country_code):
    """Lookup FBA fee from the SellerAmp fee table using dimensional weight.
    Returns fee in LOCAL currency (EUR for FR/DE/ES/IT, GBP for UK) or None."""
    mp_id = COUNTRIES[country_code]['mp_id']
    w_kg = (weight_g or 0) / 1000
    dims_cm = sorted([(length_mm or 0) / 10, (width_mm or 0) / 10, (height_mm or 0) / 10], reverse=True)
    d1, d2, d3 = dims_cm

    # Dimensional weight (L*W*H in cm / 5000)
    dim_w_kg = (dims_cm[0] * dims_cm[1] * dims_cm[2]) / 5000

    # Only search normal-price tiers (low_price_fba=0)
    for tier in FBA_FEE_TABLE:
        if tier['low_price_fba']:
            continue
        # Effective weight: use dimensional weight if tier supports it
        if tier['use_dw']:
            eff_w = max(w_kg, dim_w_kg)
        else:
            eff_w = w_kg

        # Check weight and dimensions
        if eff_w <= tier['max_dw'] and d1 <= tier['d1'] and d2 <= tier['d2'] and d3 <= tier['d3']:
            fee = tier.get(f'local_{mp_id}', 0)
            return fee if fee > 0 else None

    return None


def get_efn_fee(weight_g, height_mm, length_mm, width_mm, home_code, sale_code):
    """Lookup EFN fee for cross-border fulfillment.
    Returns fee in the SALE marketplace currency or None."""
    home_mp = COUNTRIES[home_code]['mp_id']
    sale_mp = COUNTRIES[sale_code]['mp_id']
    w_kg = (weight_g or 0) / 1000
    dims_cm = sorted([(length_mm or 0) / 10, (width_mm or 0) / 10, (height_mm or 0) / 10], reverse=True)
    d1, d2, d3 = dims_cm
    dim_w_kg = (dims_cm[0] * dims_cm[1] * dims_cm[2]) / 5000

    # Determine the EFN fee field name
    if home_mp == 'uk':
        fee_field = f'efn_uk_to_{sale_mp}'
    elif sale_mp == 'uk':
        fee_field = f'efn_{home_mp}_to_uk'
    else:
        fee_field = f'efn_{sale_mp}'

    for tier in FBA_FEE_TABLE:
        if tier['low_price_fba']:
            continue
        if tier['use_dw']:
            eff_w = max(w_kg, dim_w_kg)
        else:
            eff_w = w_kg

        if eff_w <= tier['max_dw'] and d1 <= tier['d1'] and d2 <= tier['d2'] and d3 <= tier['d3']:
            fee = tier.get(fee_field, -1)
            return fee if fee > 0 else None

    return None
