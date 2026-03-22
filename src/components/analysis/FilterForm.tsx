import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, RotateCcw } from 'lucide-react';
import type { AnalysisFilters, FilterPreset } from '@/hooks/use-file-analysis';
import { DEFAULT_FILTERS } from '@/hooks/use-file-analysis';

interface FilterFormProps {
  filters: AnalysisFilters;
  onChange: (filters: AnalysisFilters) => void;
  presets: FilterPreset[];
  onSavePreset: (name: string, filters: AnalysisFilters) => void;
  onDeletePreset: (id: string) => void;
}

const COUNTRIES = [
  { code: 'FR', label: 'France' },
  { code: 'UK', label: 'UK' },
  { code: 'DE', label: 'Allemagne' },
  { code: 'ES', label: 'Espagne' },
  { code: 'IT', label: 'Italie' },
];

const ALERT_OPTIONS = ['PL', 'IP', 'Hazmat', 'Lithium', 'Meltable', 'Oversize'];

export default function FilterForm({ filters, onChange, presets, onSavePreset, onDeletePreset }: FilterFormProps) {
  const [presetName, setPresetName] = useState('');

  const updateField = useCallback((key: keyof AnalysisFilters, value: any) => {
    onChange({ ...filters, [key]: value === '' ? null : value });
  }, [filters, onChange]);

  const updateNumber = useCallback((key: keyof AnalysisFilters, raw: string) => {
    const val = raw === '' ? null : parseFloat(raw);
    onChange({ ...filters, [key]: val });
  }, [filters, onChange]);

  const toggleAlert = useCallback((alert: string) => {
    const current = filters.exclude_alerts || [];
    const next = current.includes(alert)
      ? current.filter(a => a !== alert)
      : [...current, alert];
    onChange({ ...filters, exclude_alerts: next });
  }, [filters, onChange]);

  const handleSavePreset = useCallback(() => {
    if (!presetName.trim()) return;
    onSavePreset(presetName.trim(), filters);
    setPresetName('');
  }, [presetName, filters, onSavePreset]);

  const handleLoadPreset = useCallback((presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) onChange(preset.filters);
  }, [presets, onChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filtres d'analyse</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Presets */}
        {presets.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Presets sauvegardés</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {presets.map(p => (
                <div key={p.id} className="flex items-center gap-1">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleLoadPreset(p.id)}
                  >
                    {p.name}
                  </Badge>
                  <button
                    className="text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => onDeletePreset(p.id)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Country */}
        <div>
          <Label>Marketplace</Label>
          <Select value={filters.country} onValueChange={v => updateField('country', v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map(c => (
                <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ROI & Profit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>ROI FBA min (%)</Label>
            <Input
              type="number"
              placeholder="ex: 30"
              value={filters.min_roi_fba ?? ''}
              onChange={e => updateNumber('min_roi_fba', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Profit FBA min (€)</Label>
            <Input
              type="number"
              placeholder="ex: 5"
              value={filters.min_profit_fba ?? ''}
              onChange={e => updateNumber('min_profit_fba', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>ROI FBM min (%)</Label>
            <Input
              type="number"
              placeholder="ex: 20"
              value={filters.min_roi_fbm ?? ''}
              onChange={e => updateNumber('min_roi_fbm', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Profit FBM min (€)</Label>
            <Input
              type="number"
              placeholder="ex: 3"
              value={filters.min_profit_fbm ?? ''}
              onChange={e => updateNumber('min_profit_fbm', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Sales & Sellers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Ventes/mois min</Label>
            <Input
              type="number"
              placeholder="ex: 10"
              value={filters.min_sales_monthly ?? ''}
              onChange={e => updateNumber('min_sales_monthly', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Vendeurs FBA max</Label>
            <Input
              type="number"
              placeholder="ex: 5"
              value={filters.max_sellers_fba ?? ''}
              onChange={e => updateNumber('max_sellers_fba', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Vendeurs FBM max</Label>
            <Input
              type="number"
              placeholder="ex: 10"
              value={filters.max_sellers_fbm ?? ''}
              onChange={e => updateNumber('max_sellers_fbm', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>BSR max</Label>
            <Input
              type="number"
              placeholder="ex: 100000"
              value={filters.max_bsr ?? ''}
              onChange={e => updateNumber('max_bsr', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Variations */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Variations max</Label>
            <Input
              type="number"
              placeholder="ex: 0"
              value={filters.max_variations ?? ''}
              onChange={e => updateNumber('max_variations', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Prix vente max (€)</Label>
            <Input
              type="number"
              placeholder="ex: 200"
              value={filters.max_sell_price ?? ''}
              onChange={e => updateNumber('max_sell_price', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Alerts to exclude */}
        <div>
          <Label>Exclure alertes</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {ALERT_OPTIONS.map(alert => (
              <Badge
                key={alert}
                variant={(filters.exclude_alerts || []).includes(alert) ? 'destructive' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleAlert(alert)}
              >
                {alert}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange({ ...DEFAULT_FILTERS })}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Nom du preset..."
              value={presetName}
              onChange={e => setPresetName(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSavePreset}
              disabled={!presetName.trim()}
            >
              <Save className="h-4 w-4 mr-1" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
