import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Discord API base URL
const DISCORD_API = "https://discord.com/api/v10";

// Channel ID to scrape - can be passed as parameter or use default
const DEFAULT_CHANNEL_ID = ""; // Will be set from request body

interface DiscordMessage {
  id: string;
  content: string;
  timestamp: string;
  embeds?: DiscordEmbed[];
}

interface DiscordEmbed {
  title?: string;
  description?: string;
  fields?: { name: string; value: string; inline?: boolean }[];
  url?: string;
  footer?: { text: string };
}

interface ProductData {
  source_name: string;
  product_title: string;
  ean: string;
  cost_price: number | null;
  current_price: number;
  sale_price: number | null;
  bsr: string | null;
  bsr_percent: string | null;
  monthly_sales: string | null;
  profit: number | null;
  roi: number | null;
  fba_profit: number | null;
  fba_roi: number | null;
  private_label: string | null;
  product_size: string | null;
  meltable: string | null;
  variations: string | null;
  sellers: string | null;
  amazon_url: string | null;
  source_url: string | null;
  created_at: string;
}

// Parse number safely from string
const parseNumber = (value: string | undefined | null): number | null => {
  if (!value || value === '' || value === '-' || value === 'N/A') return null;
  const cleaned = value.toString().replace(',', '.').replace(/[^\d.-]/g, '').replace('€', '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

// Extract field value by name from embed fields
const getFieldValue = (fields: { name: string; value: string }[] | undefined, ...names: string[]): string | null => {
  if (!fields) return null;
  for (const name of names) {
    const field = fields.find(f => f.name.toLowerCase().includes(name.toLowerCase()));
    if (field) return field.value;
  }
  return null;
};

// Parse Discord embed to ProductData
const parseEmbed = (embed: DiscordEmbed, timestamp: string, sourceName: string): ProductData | null => {
  try {
    const fields = embed.fields || [];
    
    // Try to extract EAN from various field names
    const ean = getFieldValue(fields, 'ean', 'gtin', 'barcode', 'code') || 
                embed.description?.match(/\b\d{13}\b/)?.[0] ||
                embed.title?.match(/\b\d{13}\b/)?.[0];
    
    if (!ean) {
      console.log('⏭️ No EAN found in embed:', embed.title?.substring(0, 50));
      return null;
    }
    
    // Extract product title
    const productTitle = embed.title || 
                         getFieldValue(fields, 'titre', 'title', 'produit', 'product') || 
                         'Produit inconnu';
    
    // Extract prices
    const costPrice = parseNumber(getFieldValue(fields, 'prix achat', 'achat', 'cost', 'buy price', 'prix ht'));
    const salePrice = parseNumber(getFieldValue(fields, 'prix vente', 'vente', 'sale', 'sell price', 'prix amazon'));
    const currentPrice = salePrice || costPrice || 0;
    
    // Extract metrics
    const bsr = getFieldValue(fields, 'bsr', 'rank', 'classement');
    const bsrPercent = getFieldValue(fields, 'bsr %', 'bsr%', 'rank %');
    const monthlySales = getFieldValue(fields, 'ventes', 'sales', 'ventes/mois');
    
    // Extract profit/ROI
    const fbmProfit = parseNumber(getFieldValue(fields, 'fbm profit', 'profit fbm'));
    const fbmRoi = parseNumber(getFieldValue(fields, 'fbm roi', 'roi fbm'));
    const fbaProfit = parseNumber(getFieldValue(fields, 'fba profit', 'profit fba'));
    const fbaRoi = parseNumber(getFieldValue(fields, 'fba roi', 'roi fba'));
    
    // Use FBM as default profit/roi if available
    const profit = fbmProfit || fbaProfit;
    const roi = fbmRoi || fbaRoi;
    
    // Extract other fields
    const privateLabel = getFieldValue(fields, 'private label', 'pl', 'marque');
    const productSize = getFieldValue(fields, 'taille', 'size', 'dimension');
    const meltable = getFieldValue(fields, 'meltable', 'fondant');
    const variations = getFieldValue(fields, 'variations', 'var');
    const sellers = getFieldValue(fields, 'vendeurs', 'sellers', 'offers');
    
    // Extract URLs
    const amazonUrl = getFieldValue(fields, 'amazon', 'lien amazon', 'amazon url') || 
                      embed.url?.includes('amazon') ? embed.url : null;
    const sourceUrl = getFieldValue(fields, 'source', 'lien source', 'source url') ||
                      (!embed.url?.includes('amazon') ? embed.url : null);
    
    return {
      source_name: sourceName,
      product_title: productTitle.substring(0, 500),
      ean: ean,
      cost_price: costPrice,
      current_price: currentPrice,
      sale_price: salePrice,
      bsr: bsr,
      bsr_percent: bsrPercent,
      monthly_sales: monthlySales,
      profit: profit,
      roi: roi,
      fba_profit: fbaProfit,
      fba_roi: fbaRoi,
      private_label: privateLabel,
      product_size: productSize,
      meltable: meltable,
      variations: variations,
      sellers: sellers,
      amazon_url: amazonUrl,
      source_url: sourceUrl,
      created_at: new Date(timestamp).toISOString(),
    };
  } catch (error) {
    console.error('Error parsing embed:', error);
    return null;
  }
};

// Fetch messages from Discord channel using REST API
const fetchDiscordMessages = async (channelId: string, limit: number = 100): Promise<DiscordMessage[]> => {
  const token = Deno.env.get("DISCORD_USER_TOKEN");
  
  if (!token) {
    throw new Error("DISCORD_USER_TOKEN is not configured");
  }
  
  console.log(`📡 Fetching ${limit} messages from channel ${channelId}`);
  
  const response = await fetch(`${DISCORD_API}/channels/${channelId}/messages?limit=${limit}`, {
    headers: {
      "Authorization": token,
      "Content-Type": "application/json",
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Discord API error: ${response.status} - ${errorText}`);
    throw new Error(`Discord API error: ${response.status} - ${errorText}`);
  }
  
  const messages = await response.json();
  console.log(`✅ Fetched ${messages.length} messages`);
  
  return messages;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔄 Starting Discord Product Find sync...");

    // Parse request body for channel ID and source name
    let channelId = DEFAULT_CHANNEL_ID;
    let sourceName = "Discord";
    let limit = 100;
    
    if (req.method === "POST") {
      try {
        const body = await req.json();
        channelId = body.channel_id || channelId;
        sourceName = body.source_name || sourceName;
        limit = body.limit || limit;
      } catch {
        // Ignore JSON parse errors, use defaults
      }
    }
    
    if (!channelId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "channel_id is required. Send POST with { channel_id: '123...', source_name: 'SourceName', limit: 100 }" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get admin user ID
    const { data: adminId, error: adminError } = await supabaseClient.rpc('get_admin_user_id');
    if (adminError || !adminId) {
      console.error('Admin error:', adminError);
      throw new Error('No admin user found');
    }
    console.log(`👤 Admin ID: ${adminId}`);

    // Fetch messages from Discord
    const messages = await fetchDiscordMessages(channelId, limit);
    
    // Get existing EANs to avoid duplicates (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: existingAlerts } = await supabaseClient
      .from('product_find_alerts')
      .select('ean, created_at')
      .gte('created_at', sevenDaysAgo.toISOString());
    
    const existingKeys = new Set(
      (existingAlerts || []).map(a => `${a.ean}_${a.created_at?.slice(0, 10)}`)
    );
    
    let insertedCount = 0;
    let skippedCount = 0;
    let parsedCount = 0;
    
    // Process each message
    for (const message of messages) {
      if (!message.embeds || message.embeds.length === 0) continue;
      
      for (const embed of message.embeds) {
        const productData = parseEmbed(embed, message.timestamp, sourceName);
        
        if (!productData) {
          skippedCount++;
          continue;
        }
        
        parsedCount++;
        
        // Check for duplicates
        const key = `${productData.ean}_${productData.created_at.slice(0, 10)}`;
        if (existingKeys.has(key)) {
          console.log(`⏭️ Duplicate: ${productData.ean}`);
          skippedCount++;
          continue;
        }
        
        // Insert into database
        const { error: insertError } = await supabaseClient
          .from('product_find_alerts')
          .insert({
            admin_id: adminId,
            ...productData,
          });
        
        if (insertError) {
          console.error('❌ Insert error:', insertError);
          skippedCount++;
        } else {
          existingKeys.add(key);
          insertedCount++;
          console.log(`✅ Inserted: ${productData.product_title.substring(0, 50)}... (${productData.ean})`);
        }
      }
    }

    console.log(`✅ Sync completed: ${insertedCount} inserted, ${parsedCount} parsed, ${skippedCount} skipped`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sync completed`,
        stats: {
          messages_fetched: messages.length,
          embeds_parsed: parsedCount,
          inserted: insertedCount,
          skipped: skippedCount,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Sync error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
