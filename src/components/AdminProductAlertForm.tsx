import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Sparkles, CheckCircle } from 'lucide-react';

interface AdminProductAlertFormProps {
  onSuccess: () => void;
}

interface ParsedAlert {
  source_name: string;
  product_title: string;
  ean: string;
  original_price: number | null;
  current_price: number;
  bsr: string | null;
  bsr_percent: string | null;
  cost_price: number | null;
  sale_price: number | null;
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
  sas_url: string | null;
  source_url: string | null;
}

function parseAlertMessage(message: string): ParsedAlert | null {
  try {
    const lines = message.trim().split('\n').map(l => l.trim()).filter(l => l);
    
    if (lines.length < 5) return null;

    // First line is source name
    const source_name = lines[0];
    
    // Find product title (line after source, before EAN)
    let product_title = '';
    let eanIndex = -1;
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === 'EAN' || lines[i].startsWith('EAN')) {
        eanIndex = i;
        break;
      }
      if (lines[i] && !lines[i].includes(':') && lines[i].length > 10) {
        product_title = lines[i];
      }
    }

    if (!product_title) {
      product_title = lines[1];
    }

    // Find EAN
    let ean = '';
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === 'EAN' && lines[i + 1]) {
        ean = lines[i + 1].replace(/\D/g, '');
        break;
      }
      const eanMatch = lines[i].match(/^(\d{12,13})$/);
      if (eanMatch) {
        ean = eanMatch[1];
        break;
      }
    }

    // Parse Price
    let original_price: number | null = null;
    let current_price = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === 'Price' && lines[i + 1]) {
        const priceMatch = lines[i + 1].match(/(\d+[.,]?\d*)\s*€?\s*→\s*(\d+[.,]?\d*)\s*€?/);
        if (priceMatch) {
          original_price = parseFloat(priceMatch[1].replace(',', '.'));
          current_price = parseFloat(priceMatch[2].replace(',', '.'));
        } else {
          const singlePrice = lines[i + 1].match(/(\d+[.,]?\d*)\s*€?/);
          if (singlePrice) {
            current_price = parseFloat(singlePrice[1].replace(',', '.'));
          }
        }
        break;
      }
    }

    // Parse SAS section
    let bsr: string | null = null;
    let bsr_percent: string | null = null;
    let cost_price: number | null = null;
    let sale_price: number | null = null;
    let monthly_sales: string | null = null;
    let profit: number | null = null;
    let roi: number | null = null;
    let fba_profit: number | null = null;
    let fba_roi: number | null = null;

    for (const line of lines) {
      // BSR
      if (line.includes('BSR:')) {
        const bsrMatch = line.match(/BSR:\s*(\d+)/);
        const percentMatch = line.match(/\(([^)]+)\)/);
        if (bsrMatch) bsr = bsrMatch[1];
        if (percentMatch) bsr_percent = percentMatch[1];
      }
      
      // Cost Price
      if (line.includes('Cost Price:')) {
        const match = line.match(/Cost Price:\s*(\d+[.,]?\d*)/);
        if (match) cost_price = parseFloat(match[1].replace(',', '.'));
      }
      
      // Sale Price
      if (line.includes('Sale Price:')) {
        const match = line.match(/Sale Price:\s*(\d+[.,]?\d*)/);
        if (match) sale_price = parseFloat(match[1].replace(',', '.'));
      }
      
      // Sales
      if (line.includes('Sales:')) {
        const match = line.match(/Sales:\s*(.+)/);
        if (match) monthly_sales = match[1].trim();
      }
      
      // FBM Profit & ROI
      if (line.includes('Type:') && line.includes('FBM')) {
        // Next lines contain profit and ROI
      }
      if (line.includes('Profit:') && !fba_profit) {
        const match = line.match(/Profit:\s*(\d+[.,]?\d*)/);
        if (match) profit = parseFloat(match[1].replace(',', '.'));
      }
      if (line.includes('ROI:') && !fba_roi) {
        const match = line.match(/ROI:\s*(\d+[.,]?\d*)/);
        if (match) roi = parseFloat(match[1].replace(',', '.'));
      }
    }

    // Parse FBA section specifically
    let inFBA = false;
    for (const line of lines) {
      if (line.includes('Type:') && line.includes('FBA')) {
        inFBA = true;
        continue;
      }
      if (inFBA) {
        if (line.includes('Profit:')) {
          const match = line.match(/Profit:\s*(\d+[.,]?\d*)/);
          if (match) fba_profit = parseFloat(match[1].replace(',', '.'));
        }
        if (line.includes('ROI:')) {
          const match = line.match(/ROI:\s*(\d+[.,]?\d*)/);
          if (match) fba_roi = parseFloat(match[1].replace(',', '.'));
          inFBA = false; // End of FBA section
        }
      }
    }

    // Parse Alerts section
    let private_label: string | null = null;
    let product_size: string | null = null;
    let meltable: string | null = null;
    let variations: string | null = null;
    let sellers: string | null = null;

    for (const line of lines) {
      if (line.includes('Private Label:')) {
        const match = line.match(/Private Label:\s*(.+)/);
        if (match) private_label = match[1].trim();
      }
      if (line.includes('Size:')) {
        const match = line.match(/Size:\s*(.+)/);
        if (match) product_size = match[1].trim();
      }
      if (line.includes('Meltable:')) {
        const match = line.match(/Meltable:\s*(.+)/);
        if (match) meltable = match[1].trim();
      }
      if (line.includes('Variations:')) {
        const match = line.match(/Variations:\s*(.+)/);
        if (match) variations = match[1].trim();
      }
      if (line.includes('Sellers:')) {
        const match = line.match(/Sellers:\s*(.+)/);
        if (match) sellers = match[1].trim();
      }
    }

    // Parse Links section
    let amazon_url: string | null = null;
    let sas_url: string | null = null;
    let source_url: string | null = null;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === 'Links') {
        const linksLine = lines[i + 1];
        if (linksLine) {
          // Links are in format: "Amazon | SAS | Leclerc"
          // We need to find the URLs - they might be in the next lines or embedded
          continue;
        }
      }
      // Look for URLs
      if (lines[i].includes('amazon.') || lines[i].includes('amzn.')) {
        amazon_url = lines[i].startsWith('http') ? lines[i] : `https://${lines[i]}`;
      }
    }

    // Generate standard URLs if we have the EAN
    if (ean) {
      if (!amazon_url) {
        amazon_url = `https://www.amazon.fr/dp/s?k=${ean}`;
      }
      sas_url = `https://www.selleramp.com/sas/lookup?ean=${ean}`;
    }

    return {
      source_name,
      product_title,
      ean,
      original_price,
      current_price,
      bsr,
      bsr_percent,
      cost_price,
      sale_price,
      monthly_sales,
      profit,
      roi,
      fba_profit,
      fba_roi,
      private_label,
      product_size,
      meltable,
      variations,
      sellers,
      amazon_url,
      sas_url,
      source_url
    };
  } catch (error) {
    console.error('Error parsing message:', error);
    return null;
  }
}

export default function AdminProductAlertForm({ onSuccess }: AdminProductAlertFormProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<ParsedAlert | null>(null);

  const handleParse = () => {
    const parsed = parseAlertMessage(message);
    if (parsed && parsed.ean && parsed.product_title) {
      setParsedPreview(parsed);
      toast.success('Message parsé avec succès !');
    } else {
      toast.error('Format de message invalide. Vérifiez le contenu.');
      setParsedPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!parsedPreview) {
      toast.error('Parsez d\'abord le message');
      return;
    }

    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('product_find_alerts')
        .insert({
          admin_id: userData.user.id,
          ...parsedPreview,
          raw_message: message
        });

      if (error) throw error;

      toast.success('Alerte publiée avec succès !');
      setMessage('');
      setParsedPreview(null);
      onSuccess();
    } catch (error) {
      console.error('Error creating alert:', error);
      toast.error('Erreur lors de la création de l\'alerte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">
          Coller le message d'alerte
        </label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Leclerc

Barbie Color Reveal Poupée...

EAN
0194735178766

Price
24.11 € → 8.00 €

SAS
BSR: 45576 (0.71%)
...`}
          className="min-h-[300px] font-mono text-sm"
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleParse}
          disabled={!message.trim()}
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Parser le message
        </Button>
        
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!parsedPreview || isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          Publier l'alerte
        </Button>
      </div>

      {/* Preview */}
      {parsedPreview && (
        <Card className="mt-4 border-green-500/50 bg-green-500/5">
          <CardContent className="p-4 space-y-2">
            <h4 className="font-semibold text-green-600">Aperçu de l'alerte</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Source:</span> {parsedPreview.source_name}</div>
              <div><span className="text-muted-foreground">EAN:</span> {parsedPreview.ean}</div>
              <div className="col-span-2"><span className="text-muted-foreground">Produit:</span> {parsedPreview.product_title}</div>
              <div><span className="text-muted-foreground">Prix:</span> {parsedPreview.original_price && `${parsedPreview.original_price}€ → `}{parsedPreview.current_price}€</div>
              {parsedPreview.bsr && <div><span className="text-muted-foreground">BSR:</span> {parsedPreview.bsr}</div>}
              {parsedPreview.profit && <div><span className="text-muted-foreground">FBM Profit:</span> {parsedPreview.profit}€ ({parsedPreview.roi}%)</div>}
              {parsedPreview.fba_profit && <div><span className="text-muted-foreground">FBA Profit:</span> {parsedPreview.fba_profit}€ ({parsedPreview.fba_roi}%)</div>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
