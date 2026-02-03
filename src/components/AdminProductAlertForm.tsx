import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Sparkles, CheckCircle } from 'lucide-react';

const AVAILABLE_SOURCES = [
  { value: 'Leclerc', label: 'Leclerc' },
  { value: 'Carrefour', label: 'Carrefour' },
  { value: 'Auchan', label: 'Auchan' },
  { value: 'SmythsToys', label: 'SmythsToys' },
  { value: 'Miamland', label: 'Miamland' },
  { value: 'Stokomani', label: 'Stokomani' },
  { value: 'Eany', label: 'Eany' },
  { value: 'Qogita2', label: 'Qogita 2' },
];

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
    const lines = message.trim().split('\n').map(l => l.trim());
    
    // Initialize result
    const result: ParsedAlert = {
      source_name: '',
      product_title: '',
      ean: '',
      original_price: null,
      current_price: 0,
      bsr: null,
      bsr_percent: null,
      cost_price: null,
      sale_price: null,
      monthly_sales: null,
      profit: null,
      roi: null,
      fba_profit: null,
      fba_roi: null,
      private_label: null,
      product_size: null,
      meltable: null,
      variations: null,
      sellers: null,
      amazon_url: null,
      sas_url: null,
      source_url: null
    };

    // First non-empty line is source name
    for (const line of lines) {
      if (line && !line.includes(':') && line.length < 50) {
        result.source_name = line;
        break;
      }
    }

    // Find sections
    let currentSection = 'header';
    let productTitleLines: string[] = [];
    let fbmFound = false;
    let fbaFound = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1] || '';
      
      // Detect sections
      if (line === 'EAN') {
        currentSection = 'ean';
        continue;
      }
      if (line === 'Price') {
        currentSection = 'price';
        continue;
      }
      if (line === 'SAS') {
        currentSection = 'sas';
        continue;
      }
      if (line === 'Alerts') {
        currentSection = 'alerts';
        continue;
      }
      if (line === 'Links') {
        currentSection = 'links';
        continue;
      }

      // Parse based on section
      if (currentSection === 'header') {
        // Collect product title (lines after source, before EAN)
        if (line && line !== result.source_name && !line.match(/^\d{12,13}$/)) {
          productTitleLines.push(line);
        }
      }

      // EAN section
      if (currentSection === 'ean') {
        const eanMatch = line.match(/^(\d{12,13})$/);
        if (eanMatch) {
          result.ean = eanMatch[1];
          currentSection = 'after_ean';
        }
      }

      // Price section
      if (currentSection === 'price') {
        // Format: "24.11 € → 8.00 €" or just "8.00 €"
        const priceArrowMatch = line.match(/(\d+[.,]?\d*)\s*€?\s*→\s*(\d+[.,]?\d*)\s*€?/);
        if (priceArrowMatch) {
          result.original_price = parseFloat(priceArrowMatch[1].replace(',', '.'));
          result.current_price = parseFloat(priceArrowMatch[2].replace(',', '.'));
          currentSection = 'after_price';
        } else {
          const singlePriceMatch = line.match(/(\d+[.,]?\d*)\s*€/);
          if (singlePriceMatch) {
            result.current_price = parseFloat(singlePriceMatch[1].replace(',', '.'));
            currentSection = 'after_price';
          }
        }
      }

      // SAS section - parse all fields
      if (currentSection === 'sas') {
        // BSR: 45576 (0.71%)
        const bsrMatch = line.match(/BSR:\s*(\d+)\s*\(([^)]+)\)/);
        if (bsrMatch) {
          result.bsr = bsrMatch[1];
          result.bsr_percent = bsrMatch[2];
        }

        // Cost Price: 8.00 €
        const costMatch = line.match(/Cost\s*Price:\s*(\d+[.,]?\d*)\s*€?/);
        if (costMatch) {
          result.cost_price = parseFloat(costMatch[1].replace(',', '.'));
        }

        // Sale Price: 24.11 €
        const saleMatch = line.match(/Sale\s*Price:\s*(\d+[.,]?\d*)\s*€?/);
        if (saleMatch) {
          result.sale_price = parseFloat(saleMatch[1].replace(',', '.'));
        }

        // Sales: 131 /mo
        const salesMatch = line.match(/Sales:\s*(.+)/);
        if (salesMatch) {
          result.monthly_sales = salesMatch[1].trim();
        }

        // Detect Type sections - FBM comes first, then FBA
        if (line.includes('Type:') && line.includes('FBM')) {
          fbmFound = true;
          fbaFound = false;
        }
        if (line.includes('Type:') && line.includes('FBA')) {
          fbaFound = true;
          fbmFound = false;
        }

        // Profit: 9.28 €
        const profitMatch = line.match(/Profit:\s*(\d+[.,]?\d*)\s*€?/);
        if (profitMatch) {
          const profitValue = parseFloat(profitMatch[1].replace(',', '.'));
          if (fbaFound) {
            result.fba_profit = profitValue;
          } else if (fbmFound) {
            result.profit = profitValue;
          }
        }

        // ROI: 82.78 %
        const roiMatch = line.match(/ROI:\s*(\d+[.,]?\d*)\s*%?/);
        if (roiMatch) {
          const roiValue = parseFloat(roiMatch[1].replace(',', '.'));
          if (fbaFound) {
            result.fba_roi = roiValue;
          } else if (fbmFound) {
            result.roi = roiValue;
          }
        }
      }

      // Alerts section
      if (currentSection === 'alerts') {
        // Private Label: Likely
        const plMatch = line.match(/Private\s*Label:\s*(.+)/);
        if (plMatch) {
          result.private_label = plMatch[1].trim();
        }

        // Size: Standard
        const sizeMatch = line.match(/Size:\s*(\S+)/);
        if (sizeMatch) {
          result.product_size = sizeMatch[1].trim();
        }

        // Meltable: No
        const meltMatch = line.match(/Meltable:\s*(\S+)/);
        if (meltMatch) {
          result.meltable = meltMatch[1].trim();
        }

        // Variations: 0
        const varMatch = line.match(/Variations:\s*(\S+)/);
        if (varMatch) {
          result.variations = varMatch[1].trim();
        }

        // Sellers: 18
        const sellersMatch = line.match(/Sellers:\s*(\S+)/);
        if (sellersMatch) {
          result.sellers = sellersMatch[1].trim();
        }
      }

      // Links section - typically "Amazon | SAS | Leclerc"
      if (currentSection === 'links') {
        // Generate URLs based on EAN
        if (result.ean) {
          result.amazon_url = `https://www.amazon.fr/dp/s?k=${result.ean}`;
          result.sas_url = `https://www.selleramp.com/sas/lookup?ean=${result.ean}`;
        }
      }
    }

    // Set product title from collected lines
    if (productTitleLines.length > 0) {
      // Take the longest line as product title (usually the actual title)
      result.product_title = productTitleLines.reduce((a, b) => a.length > b.length ? a : b);
    }

    // Validate minimum required fields (source_name is provided by selector)
    if (!result.ean || !result.product_title) {
      console.error('Missing required fields:', { ean: result.ean, title: result.product_title });
      return null;
    }

    return result;
  } catch (error) {
    console.error('Error parsing message:', error);
    return null;
  }
}

export default function AdminProductAlertForm({ onSuccess }: AdminProductAlertFormProps) {
  const [message, setMessage] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<ParsedAlert | null>(null);

  const handleParse = () => {
    if (!selectedSource) {
      toast.error('Sélectionnez une source d\'abord');
      return;
    }
    const parsed = parseAlertMessage(message);
    if (parsed) {
      // Override source with selected value
      parsed.source_name = selectedSource;
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
      setSelectedSource('');
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
          Source de l'alerte
        </label>
        <Select value={selectedSource} onValueChange={setSelectedSource}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner une source..." />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_SOURCES.map((source) => (
              <SelectItem key={source.value} value={source.value}>
                {source.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          Coller le message d'alerte
        </label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Barbie Color Reveal Poupée...

EAN

0194735178766

Price

24.11 € → 8.00 €

SAS

BSR: 45576 (0.71%)
Cost Price: 8.00 €
Sale Price: 24.11 €
Sales: 131 /mo

Type: FBM 🔹
Profit: 9.28 €
ROI: 82.78 %

Type: FBA 🔸
Profit: 4.48 €
ROI: 44.14 %

Alerts

Private Label: Likely
Size: Standard
Meltable: No
Variations: 0
Sellers: 18

Links

Amazon | SAS | Leclerc`}
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
          <CardContent className="p-4 space-y-4">
            <h4 className="font-semibold text-green-600 text-lg">✅ Aperçu de l'alerte</h4>
            
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <div><span className="text-muted-foreground">Source:</span> <strong>{parsedPreview.source_name}</strong></div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">EAN:</span>
                <code className="bg-muted px-2 py-1 rounded font-mono">{parsedPreview.ean}</code>
              </div>
            </div>
            
            <div className="text-sm">
              <span className="text-muted-foreground">Produit:</span> <strong>{parsedPreview.product_title}</strong>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm border-t pt-3">
              <div>
                <span className="text-muted-foreground">Prix:</span>{' '}
                {parsedPreview.original_price && <span className="line-through mr-1">{parsedPreview.original_price}€</span>}
                <strong className="text-green-600">{parsedPreview.current_price}€</strong>
              </div>
              {parsedPreview.bsr && (
                <div>
                  <span className="text-muted-foreground">BSR:</span>{' '}
                  <strong>{parsedPreview.bsr}</strong>
                  {parsedPreview.bsr_percent && <span className="text-muted-foreground ml-1">({parsedPreview.bsr_percent})</span>}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              {parsedPreview.cost_price !== null && (
                <div><span className="text-muted-foreground">Cost Price:</span> <strong>{parsedPreview.cost_price}€</strong></div>
              )}
              {parsedPreview.sale_price !== null && (
                <div><span className="text-muted-foreground">Sale Price:</span> <strong>{parsedPreview.sale_price}€</strong></div>
              )}
              {parsedPreview.monthly_sales && (
                <div><span className="text-muted-foreground">Sales:</span> <strong>{parsedPreview.monthly_sales}</strong></div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm border-t pt-3">
              {(parsedPreview.profit !== null || parsedPreview.roi !== null) && (
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <span className="font-semibold text-blue-600">FBM 🔹</span>
                  <div className="mt-1">Profit: <strong>{parsedPreview.profit}€</strong> | ROI: <strong>{parsedPreview.roi}%</strong></div>
                </div>
              )}
              {(parsedPreview.fba_profit !== null || parsedPreview.fba_roi !== null) && (
                <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                  <span className="font-semibold text-orange-600">FBA 🔸</span>
                  <div className="mt-1">Profit: <strong>{parsedPreview.fba_profit}€</strong> | ROI: <strong>{parsedPreview.fba_roi}%</strong></div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 text-xs border-t pt-3">
              {parsedPreview.private_label && (
                <span className="bg-muted px-2 py-1 rounded">Private Label: <strong>{parsedPreview.private_label}</strong></span>
              )}
              {parsedPreview.product_size && (
                <span className="bg-muted px-2 py-1 rounded">Size: <strong>{parsedPreview.product_size}</strong></span>
              )}
              {parsedPreview.meltable && (
                <span className="bg-muted px-2 py-1 rounded">Meltable: <strong>{parsedPreview.meltable}</strong></span>
              )}
              {parsedPreview.variations && (
                <span className="bg-muted px-2 py-1 rounded">Variations: <strong>{parsedPreview.variations}</strong></span>
              )}
              {parsedPreview.sellers && (
                <span className="bg-muted px-2 py-1 rounded">Sellers: <strong>{parsedPreview.sellers}</strong></span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
