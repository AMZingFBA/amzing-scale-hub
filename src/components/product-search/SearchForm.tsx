import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Save, RotateCcw, SlidersHorizontal, Loader2 } from 'lucide-react';
import type { SearchFilters, SearchPreset } from '@/lib/product-search-types';
import { MARKETPLACE_OPTIONS, CATEGORY_OPTIONS, DEFAULT_FILTERS } from '@/lib/product-search-types';

interface SearchFormProps {
  onSubmit: (name: string, filters: SearchFilters) => Promise<any>;
  onSavePreset: (name: string, filters: SearchFilters) => Promise<any>;
  presets: SearchPreset[];
  onLoadPreset: (preset: SearchPreset) => void;
  onDeletePreset: (presetId: string) => void;
  isSearching: boolean;
}

export default function SearchForm({
  onSubmit,
  onSavePreset,
  presets,
  onLoadPreset,
  onDeletePreset,
  isSearching,
}: SearchFormProps) {
  const [name, setName] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({ ...DEFAULT_FILTERS });
  const [brandsIncludeText, setBrandsIncludeText] = useState('');
  const [brandsExcludeText, setBrandsExcludeText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cleanFilters: SearchFilters = { ...filters };
    if (brandsIncludeText.trim()) {
      cleanFilters.brands_include = brandsIncludeText.split(',').map(b => b.trim()).filter(Boolean);
    }
    if (brandsExcludeText.trim()) {
      cleanFilters.brands_exclude = brandsExcludeText.split(',').map(b => b.trim()).filter(Boolean);
    }

    await onSubmit(name, cleanFilters);
  };

  const handleReset = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setBrandsIncludeText('');
    setBrandsExcludeText('');
    setName('');
  };

  const handleSavePreset = async () => {
    if (!name.trim()) return;
    await onSavePreset(name, filters);
  };

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            Nouvelle recherche
          </CardTitle>
          {presets.length > 0 && (
            <Select onValueChange={(id) => {
              const preset = presets.find(p => p.id === id);
              if (preset) {
                setName(preset.name);
                setFilters(preset.filters);
                onLoadPreset(preset);
              }
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Charger un preset" />
              </SelectTrigger>
              <SelectContent>
                {presets.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom + Mots-clés */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search-name">Nom de la recherche *</Label>
              <Input
                id="search-name"
                placeholder="Ex: Jouets Noël ROI 30%+"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Mots-clés</Label>
              <Input
                id="keywords"
                placeholder="Ex: lego, drone, écouteurs..."
                value={filters.keywords || ''}
                onChange={e => updateFilter('keywords', e.target.value)}
                maxLength={500}
              />
            </div>
          </div>

          {/* Marketplace + Catégorie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Marketplace</Label>
              <div className="flex flex-wrap gap-2">
                {MARKETPLACE_OPTIONS.map(mp => (
                  <Badge
                    key={mp.value}
                    variant={filters.marketplaces?.includes(mp.value) ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors"
                    onClick={() => {
                      const current = filters.marketplaces || [];
                      if (current.includes(mp.value)) {
                        updateFilter('marketplaces', current.filter(v => v !== mp.value));
                      } else {
                        updateFilter('marketplaces', [...current, mp.value]);
                      }
                    }}
                  >
                    {mp.label}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select
                value={filters.category || ''}
                onValueChange={v => updateFilter('category', v || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes</SelectItem>
                  {CATEGORY_OPTIONS.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Critères financiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>ROI minimum: {filters.roi_min || 0}%</Label>
              <Slider
                value={[filters.roi_min || 0]}
                onValueChange={([v]) => updateFilter('roi_min', v)}
                min={0}
                max={200}
                step={5}
              />
            </div>
            <div className="space-y-2">
              <Label>Marge minimum: {filters.margin_min || 0}%</Label>
              <Slider
                value={[filters.margin_min || 0]}
                onValueChange={([v]) => updateFilter('margin_min', v)}
                min={0}
                max={80}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Profit minimum</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.profit_min || ''}
                onChange={e => updateFilter('profit_min', e.target.value ? Number(e.target.value) : undefined)}
                min={0}
                step={0.5}
              />
            </div>
          </div>

          {/* Prix + BSR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Prix minimum (&#8364;)</Label>
              <Input
                type="number"
                placeholder="5"
                value={filters.price_min || ''}
                onChange={e => updateFilter('price_min', e.target.value ? Number(e.target.value) : undefined)}
                min={0}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Prix maximum (&#8364;)</Label>
              <Input
                type="number"
                placeholder="200"
                value={filters.price_max || ''}
                onChange={e => updateFilter('price_max', e.target.value ? Number(e.target.value) : undefined)}
                min={0}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>BSR maximum</Label>
              <Input
                type="number"
                placeholder="100000"
                value={filters.bsr_max || ''}
                onChange={e => updateFilter('bsr_max', e.target.value ? Number(e.target.value) : undefined)}
                min={0}
                step={1000}
              />
            </div>
          </div>

          {/* Filtres avancés */}
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced">
              <AccordionTrigger className="text-sm text-muted-foreground">
                Filtres avancés
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ventes mensuelles minimum</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={filters.monthly_sales_min || ''}
                      onChange={e => updateFilter('monthly_sales_min', e.target.value ? Number(e.target.value) : undefined)}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Concurrence maximum (1-10)</Label>
                    <Input
                      type="number"
                      placeholder="8"
                      value={filters.competition_max || ''}
                      onChange={e => updateFilter('competition_max', e.target.value ? Number(e.target.value) : undefined)}
                      min={1}
                      max={10}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Marques à inclure (séparées par des virgules)</Label>
                    <Input
                      placeholder="Samsung, Sony, LEGO..."
                      value={brandsIncludeText}
                      onChange={e => setBrandsIncludeText(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Marques à exclure</Label>
                    <Input
                      placeholder="Generic, NoName..."
                      value={brandsExcludeText}
                      onChange={e => setBrandsExcludeText(e.target.value)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={isSearching || !name.trim()} className="flex-1 md:flex-none">
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Recherche en cours...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Lancer la recherche
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleSavePreset} disabled={!name.trim()}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
            <Button type="button" variant="ghost" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
