/**
 * Supabase queue worker.
 * Polls product_searches for pending rows via secure RPC functions (SECURITY DEFINER),
 * runs the Actorio scraper, stores results in search_results_cache, and marks done.
 *
 * Uses the anon key — no service_role key needed.
 * Protected by a shared bridge secret embedded in the SQL functions.
 */
import { createClient } from '@supabase/supabase-js';
import { search, type ActorioFilters } from './scraper.js';

const POLL_INTERVAL_MS = 8_000;
const CACHE_TTL_MS     = 2 * 3600_000; // 2h

export function startWorker(): (() => void) | undefined {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const bridgeSecret = process.env.BRIDGE_SECRET;

  if (!supabaseUrl || !supabaseKey || !bridgeSecret) {
    console.warn('[worker] SUPABASE_URL / SUPABASE_ANON_KEY / BRIDGE_SECRET not set — queue disabled');
    console.warn('[worker]  → Members on amzingfba.com wont get real Actorio results until configured');
    return undefined;
  }

  const db = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  let busy = false;

  async function tick() {
    if (busy) return;
    busy = true;
    try { await processNext(db, bridgeSecret!); }
    catch (e: any) { console.error('[worker] Tick error:', e.message); }
    finally { busy = false; }
  }

  const timer = setInterval(tick, POLL_INTERVAL_MS);
  tick(); // immediate first run

  console.log(`[worker] Started — polling every ${POLL_INTERVAL_MS / 1000} s`);
  return () => clearInterval(timer);
}

async function processNext(db: any, secret: string) {
  // Claim next pending search via secure RPC (bypasses RLS)
  const { data, error } = await db.rpc('bridge_claim_next_search', { p_secret: secret });

  if (error) { console.error('[worker] Claim RPC error:', error.message); return; }
  if (!data || data.length === 0) return;

  const record = data[0] as any;
  console.log(`[worker] Processing search ${record.id} (user: ${record.user_id})`);
  const t0 = Date.now();

  try {
    const filters = record.filters as ActorioFilters;
    const scraperResult = await search(filters, 100);

    // Map Actorio fields → ProductResult shape expected by the frontend
    const results = scraperResult.results.map((item: any) => ({
      id:               crypto.randomUUID(),
      title:            item.title            || '',
      asin:             item.asin             || '',
      ean:              item.ean              || '',
      image_url:        item.image_url        || '',
      price:            item.amazon_price     || 0,
      sale_price:       item.amazon_price     || 0,
      roi:              item.roi              || 0,
      margin:           item.margin           || 0,
      profit:           item.profit           || 0,
      monthly_sales:    item.monthly_sales    || 0,
      monthly_profit:   item.monthly_profit   || 0,
      bsr:              item.bsr              || 0,
      category:         item.category         || '',
      brand:            item.brand            || '',
      marketplace:      filters.marketplace   || 'amazon.fr',
      supplier:         item.supplier         || '',
      supplier_price:   item.supplier_price   || 0,
      competition_level: item.competition_level || '',
      source:           'actorio',
      found_at:         new Date().toISOString(),
    }));

    const duration = Date.now() - t0;

    // Re-apply filters client-side (Actorio server filtering is best-effort)
    const filtered = results.filter(r => {
      if (filters.roi_min          !== undefined && r.roi            < filters.roi_min)          return false;
      if (filters.roi_max          !== undefined && r.roi            > filters.roi_max)          return false;
      if (filters.unit_profit_min  !== undefined && r.profit         < filters.unit_profit_min)  return false;
      if (filters.unit_profit_max  !== undefined && r.profit         > filters.unit_profit_max)  return false;
      if (filters.amazon_price_min !== undefined && r.price          < filters.amazon_price_min) return false;
      if (filters.amazon_price_max !== undefined && r.price          > filters.amazon_price_max) return false;
      if (filters.monthly_profit_min !== undefined && r.monthly_profit < filters.monthly_profit_min) return false;
      if (filters.monthly_sales_min  !== undefined && r.monthly_sales  < filters.monthly_sales_min)  return false;
      return true;
    });
    const summary = {
      avg_roi:    r2(mean(filtered, 'roi')),
      avg_margin: r2(mean(filtered, 'margin')),
      avg_price:  r2(mean(filtered, 'price')),
      results:    filtered,
    };

    // Write results to cache
    const expiresAt = new Date(Date.now() + CACHE_TTL_MS).toISOString();
    const { error: cacheErr } = await db.rpc('bridge_upsert_cache', {
      p_secret:       secret,
      p_filters_hash: record.filters_hash,
      p_results:      filtered,
      p_count:        filtered.length,
      p_expires_at:   expiresAt,
    });
    if (cacheErr) console.error('[worker] Cache RPC error:', cacheErr.message);

    // Mark completed — Supabase Realtime notifies the frontend
    await db.rpc('bridge_complete_search', {
      p_secret:      secret,
      p_id:          record.id,
      p_count:       filtered.length,
      p_summary:     summary,
      p_duration_ms: duration,
    });

    console.log(`[worker] Done ${record.id}: ${filtered.length}/${results.length} results (after filter) in ${duration} ms`);

  } catch (err: any) {
    console.error(`[worker] Failed ${record.id}:`, err.message);
    await db.rpc('bridge_fail_search', {
      p_secret: secret,
      p_id:     record.id,
      p_error:  (err.message || 'Unknown error').substring(0, 500),
    });
  }
}

function mean(arr: any[], key: string): number {
  if (!arr.length) return 0;
  return arr.reduce((s, r) => s + (r[key] || 0), 0) / arr.length;
}
function r2(n: number): number { return Math.round(n * 100) / 100; }
