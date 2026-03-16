export interface SearchFilters {
  keywords?: string;
  marketplaces?: string[];
  category?: string;
  roi_min?: number;
  margin_min?: number;
  monthly_sales_min?: number;
  profit_min?: number;
  price_min?: number;
  price_max?: number;
  bsr_max?: number;
  competition_max?: number;
  brands_include?: string[];
  brands_exclude?: string[];
  categories_include?: string[];
  categories_exclude?: string[];
}

export interface ProductResult {
  id: string;
  title: string;
  asin?: string;
  ean?: string;
  image_url?: string;
  price: number;
  sale_price?: number;
  roi: number;
  margin: number;
  profit: number;
  monthly_sales?: number;
  bsr?: number;
  category?: string;
  brand?: string;
  marketplace?: string;
  competition_level?: string;
  source: string;
  found_at: string;
}

export interface ProductSearch {
  id: string;
  user_id: string;
  name: string;
  filters: SearchFilters;
  filters_hash: string;
  status: 'pending' | 'processing' | 'completed' | 'error' | 'cached';
  provider: string;
  results_count: number;
  cache_hit: boolean;
  processing_duration_ms?: number;
  error_message?: string;
  results_summary?: {
    avg_roi: number;
    avg_margin: number;
    avg_price: number;
    top_categories: string[];
    top_brands: string[];
  };
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export interface SearchPreset {
  id: string;
  user_id: string;
  name: string;
  filters: SearchFilters;
  created_at: string;
  updated_at: string;
}

export interface SearchResponse {
  search_id: string;
  status: string;
  cache_hit: boolean;
  results: ProductResult[];
  results_count: number;
  processing_duration_ms: number;
  error?: string;
}

export const MARKETPLACE_OPTIONS = [
  { value: 'amazon.fr', label: 'Amazon France' },
  { value: 'amazon.de', label: 'Amazon Allemagne' },
  { value: 'amazon.es', label: 'Amazon Espagne' },
  { value: 'amazon.it', label: 'Amazon Italie' },
  { value: 'amazon.co.uk', label: 'Amazon UK' },
  { value: 'amazon.com', label: 'Amazon US' },
];

export const CATEGORY_OPTIONS = [
  'Electronics',
  'Toys',
  'Home & Kitchen',
  'Sports',
  'Beauty',
  'Books',
  'Garden',
  'Baby',
  'Grocery',
  'Pet Supplies',
  'Office Products',
  'Automotive',
];

export const DEFAULT_FILTERS: SearchFilters = {
  keywords: '',
  marketplaces: ['amazon.fr'],
  roi_min: 20,
  margin_min: 15,
  price_min: 5,
  price_max: 200,
};
