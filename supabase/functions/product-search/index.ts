import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Normalized filter schema
interface SearchFilters {
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

interface SearchRequest {
  name: string;
  filters: SearchFilters;
  preset_id?: string;
}

interface ProductResult {
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

// Generate deterministic hash from filters
function generateFiltersHash(filters: SearchFilters): string {
  const normalized = JSON.stringify(
    Object.keys(filters)
      .sort()
      .reduce((acc: any, key: string) => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null && value !== '' &&
            !(Array.isArray(value) && value.length === 0)) {
          acc[key] = Array.isArray(value) ? [...value].sort() : value;
        }
        return acc;
      }, {})
  );
  // Simple hash using built-in crypto
  return btoa(normalized).replace(/[^a-zA-Z0-9]/g, '').substring(0, 64);
}

// Validate filters
function validateFilters(filters: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (filters.roi_min !== undefined && (typeof filters.roi_min !== 'number' || filters.roi_min < 0 || filters.roi_min > 10000)) {
    errors.push('roi_min must be a number between 0 and 10000');
  }
  if (filters.margin_min !== undefined && (typeof filters.margin_min !== 'number' || filters.margin_min < 0 || filters.margin_min > 100)) {
    errors.push('margin_min must be a number between 0 and 100');
  }
  if (filters.price_min !== undefined && typeof filters.price_min !== 'number') {
    errors.push('price_min must be a number');
  }
  if (filters.price_max !== undefined && typeof filters.price_max !== 'number') {
    errors.push('price_max must be a number');
  }
  if (filters.price_min !== undefined && filters.price_max !== undefined && filters.price_min > filters.price_max) {
    errors.push('price_min cannot be greater than price_max');
  }
  if (filters.bsr_max !== undefined && (typeof filters.bsr_max !== 'number' || filters.bsr_max < 0)) {
    errors.push('bsr_max must be a positive number');
  }
  if (filters.keywords !== undefined && typeof filters.keywords !== 'string') {
    errors.push('keywords must be a string');
  }
  if (filters.keywords && filters.keywords.length > 500) {
    errors.push('keywords must be less than 500 characters');
  }

  return { valid: errors.length === 0, errors };
}

// Rate limiting check
async function checkRateLimit(supabase: any, userId: string): Promise<boolean> {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('product_searches')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', fiveMinutesAgo);

  return (count || 0) < 10; // Max 10 searches per 5 minutes
}

// ======= PROVIDER ADAPTER INTERFACE =======
// This is the provider-agnostic adapter pattern.
// To add a new provider (e.g., Actorio, Keepa, etc.), create a new adapter
// that implements this interface and register it below.

interface ProviderAdapter {
  name: string;
  search(filters: SearchFilters): Promise<ProductResult[]>;
  healthCheck(): Promise<boolean>;
}

// Mock provider - generates realistic demo data for testing
class MockProvider implements ProviderAdapter {
  name = 'mock';

  async search(filters: SearchFilters): Promise<ProductResult[]> {
    // Simulate processing time (200-800ms)
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 600));

    const categories = ['Electronics', 'Toys', 'Home & Kitchen', 'Sports', 'Beauty', 'Books', 'Garden'];
    const brands = ['Samsung', 'Sony', 'Philips', 'Bosch', 'Braun', 'LEGO', 'Hasbro', 'Nike', 'Adidas'];
    const marketplaces = filters.marketplaces?.length ? filters.marketplaces : ['amazon.fr', 'amazon.de', 'amazon.es'];

    const count = 5 + Math.floor(Math.random() * 20);
    const results: ProductResult[] = [];

    for (let i = 0; i < count; i++) {
      const price = (filters.price_min || 10) + Math.random() * ((filters.price_max || 200) - (filters.price_min || 10));
      const margin = (filters.margin_min || 15) + Math.random() * (50 - (filters.margin_min || 15));
      const roi = (filters.roi_min || 20) + Math.random() * (150 - (filters.roi_min || 20));
      const profit = price * (margin / 100);
      const bsr = Math.floor(Math.random() * (filters.bsr_max || 100000));
      const monthlySales = (filters.monthly_sales_min || 10) + Math.floor(Math.random() * 500);
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const category = filters.category || categories[Math.floor(Math.random() * categories.length)];

      // Apply brand filters
      if (filters.brands_exclude?.includes(brand)) continue;
      if (filters.brands_include?.length && !filters.brands_include.includes(brand)) continue;

      // Apply category filters
      if (filters.categories_exclude?.includes(category)) continue;
      if (filters.categories_include?.length && !filters.categories_include.includes(category)) continue;

      results.push({
        id: crypto.randomUUID(),
        title: `${brand} ${filters.keywords || 'Product'} ${category} #${i + 1}`,
        asin: `B0${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        ean: `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
        price: Math.round(price * 100) / 100,
        sale_price: Math.round(price * 1.3 * 100) / 100,
        roi: Math.round(roi * 100) / 100,
        margin: Math.round(margin * 100) / 100,
        profit: Math.round(profit * 100) / 100,
        monthly_sales: monthlySales,
        bsr,
        category,
        brand,
        marketplace: marketplaces[Math.floor(Math.random() * marketplaces.length)],
        competition_level: bsr < 10000 ? 'high' : bsr < 50000 ? 'medium' : 'low',
        source: 'mock',
        found_at: new Date().toISOString(),
      });
    }

    // Apply profit_min filter
    return results.filter(r => {
      if (filters.profit_min && r.profit < filters.profit_min) return false;
      if (filters.monthly_sales_min && (r.monthly_sales || 0) < filters.monthly_sales_min) return false;
      return true;
    });
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}

// Provider registry - add new providers here
function getProvider(name: string): ProviderAdapter {
  switch (name) {
    case 'mock':
    default:
      return new MockProvider();
    // Future providers:
    // case 'actorio':
    //   return new ActorioProvider(); // Only if official API exists
    // case 'keepa':
    //   return new KeepaProvider();
    // case 'csv':
    //   return new CsvProvider();
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Create user-scoped client for auth
    const supabaseUser = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check VIP status
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('plan, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    const { data: adminRole } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!adminRole && subscription?.plan !== 'vip') {
      return new Response(
        JSON.stringify({ error: 'Accès VIP requis' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request
    const body: SearchRequest = await req.json();

    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Le nom de la recherche est requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const filters = body.filters || {};

    // Validate filters
    const validation = validateFilters(filters);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: 'Filtres invalides', details: validation.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limit check
    const withinLimit = await checkRateLimit(supabaseAdmin, user.id);
    if (!withinLimit) {
      return new Response(
        JSON.stringify({ error: 'Trop de recherches. Veuillez patienter quelques minutes.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate cache key
    const filtersHash = generateFiltersHash(filters);

    // Check cache
    const { data: cached } = await supabaseAdmin
      .from('search_results_cache')
      .select('*')
      .eq('filters_hash', filtersHash)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cached) {
      // Cache hit - create search record and return immediately
      const { data: search } = await supabaseAdmin
        .from('product_searches')
        .insert({
          user_id: user.id,
          name: body.name.trim().substring(0, 200),
          filters,
          filters_hash: filtersHash,
          status: 'cached',
          provider: cached.provider,
          results_count: cached.results_count,
          cache_hit: true,
          processing_duration_ms: Date.now() - startTime,
        })
        .select()
        .single();

      console.log(`[product-search] Cache HIT for user ${user.id}, hash: ${filtersHash}, ${cached.results_count} results`);

      return new Response(
        JSON.stringify({
          search_id: search?.id,
          status: 'cached',
          cache_hit: true,
          results: cached.results,
          results_count: cached.results_count,
          processing_duration_ms: Date.now() - startTime,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Cache miss - create search record with 'processing' status
    const { data: search, error: insertError } = await supabaseAdmin
      .from('product_searches')
      .insert({
        user_id: user.id,
        name: body.name.trim().substring(0, 200),
        filters,
        filters_hash: filtersHash,
        status: 'processing',
        provider: 'mock',
        cache_hit: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[product-search] Insert error:', insertError);
      throw insertError;
    }

    console.log(`[product-search] Cache MISS for user ${user.id}, search_id: ${search.id}, processing...`);

    // Execute search via provider
    const provider = getProvider('mock');
    let results: ProductResult[] = [];
    let errorMessage: string | undefined;

    try {
      const isHealthy = await provider.healthCheck();
      if (!isHealthy) {
        throw new Error('Provider indisponible');
      }
      results = await provider.search(filters);
    } catch (providerError: unknown) {
      errorMessage = providerError instanceof Error ? providerError.message : 'Erreur fournisseur';
      console.error(`[product-search] Provider error:`, errorMessage);
    }

    const processingDuration = Date.now() - startTime;
    const finalStatus = errorMessage ? 'error' : 'completed';

    // Update search record
    await supabaseAdmin
      .from('product_searches')
      .update({
        status: finalStatus,
        results_count: results.length,
        processing_duration_ms: processingDuration,
        error_message: errorMessage,
        results_summary: results.length > 0 ? {
          avg_roi: Math.round(results.reduce((s, r) => s + r.roi, 0) / results.length * 100) / 100,
          avg_margin: Math.round(results.reduce((s, r) => s + r.margin, 0) / results.length * 100) / 100,
          avg_price: Math.round(results.reduce((s, r) => s + r.price, 0) / results.length * 100) / 100,
          top_categories: [...new Set(results.map(r => r.category))].slice(0, 5),
          top_brands: [...new Set(results.map(r => r.brand))].slice(0, 5),
        } : null,
      })
      .eq('id', search.id);

    // Store in cache if successful
    if (!errorMessage && results.length > 0) {
      await supabaseAdmin
        .from('search_results_cache')
        .upsert({
          filters_hash: filtersHash,
          results,
          provider: 'mock',
          results_count: results.length,
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        }, { onConflict: 'filters_hash' });
    }

    console.log(`[product-search] Completed: ${results.length} results in ${processingDuration}ms (${finalStatus})`);

    return new Response(
      JSON.stringify({
        search_id: search.id,
        status: finalStatus,
        cache_hit: false,
        results: errorMessage ? [] : results,
        results_count: results.length,
        processing_duration_ms: processingDuration,
        error: errorMessage,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('[product-search] Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
