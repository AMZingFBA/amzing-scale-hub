import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  Search, Save, RotateCcw, FolderOpen, Loader2,
  ShoppingCart, Truck, SlidersHorizontal, X,
} from 'lucide-react';
import type { SearchFilters, SearchPreset } from '@/lib/product-search-types';
import {
  MARKETPLACE_OPTIONS, CATEGORY_OPTIONS, DEFAULT_FILTERS,
  COUNTRY_OPTIONS, SUPPLIER_TYPE_OPTIONS, SUPPLIER_OPTIONS,
  UPDATED_RECENTLY_OPTIONS,
} from '@/lib/product-search-types';

interface SearchFormProps {
  onSubmit: (filters: SearchFilters) => Promise<any>;
  onSavePreset: (name: string, filters: SearchFilters) => Promise<any>;
  presets: SearchPreset[];
  onLoadPreset: (preset: SearchPreset) => void;
  onDeletePreset: (presetId: string) => void;
  isSearching: boolean;
}

function NumericRange({
  label, minVal, maxVal, onMinChange, onMaxChange, step, placeholder,
}: {
  label: string;
  minVal?: number;
  maxVal?: number;
  onMinChange: (v: number | undefined) => void;
  onMaxChange: (v: number | undefined) => void;
  step?: number;
  placeholder?: [string, string];
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder={placeholder?.[0] || 'Min'}
          value={minVal ?? ''}
          onChange={e => onMinChange(e.target.value ? Number(e.target.value) : undefined)}
          className="h-8 text-sm"
          step={step}
          min={0}
        />
        <Input
          type="number"
          placeholder={placeholder?.[1] || 'Max'}
          value={maxVal ?? ''}
          onChange={e => onMaxChange(e.target.value ? Number(e.target.value) : undefined)}
          className="h-8 text-sm"
          step={step}
          min={0}
        />
      </div>
    </div>
  );
}

export default function SearchForm({
  onSubmit, onSavePreset, presets, onLoadPreset, onDeletePreset, isSearching,
}: SearchFormProps) {
  const [filters, setFilters] = useState<SearchFilters>({ ...DEFAULT_FILTERS });
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [supplierSearch, setSupplierSearch] = useState('');

  const filteredSuppliers = useMemo(() => {
    if (!supplierSearch.trim()) return SUPPLIER_OPTIONS;
    const q = supplierSearch.toLowerCase();
    return SUPPLIER_OPTIONS.filter(s => s.toLowerCase().includes(q));
  }, [supplierSearch]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(filters);
  };

  const handleReset = () => {
    setFilters({ ...DEFAULT_FILTERS });
  };

  const handleSave = async () => {
    if (!presetName.trim()) return;
    await onSavePreset(presetName.trim(), filters);
    setShowSaveModal(false);
    setPresetName('');
  };

  const handleLoadPreset = (preset: SearchPreset) => {
    setFilters({ ...preset.filters });
    onLoadPreset(preset);
    setShowLoadModal(false);
  };

  const update = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleSupplier = (supplier: string) => {
    const current = filters.suppliers || [];
    if (current.includes(supplier)) {
      update('suppliers', current.filter(s => s !== supplier));
    } else {
      update('suppliers', [...current, supplier]);
    }
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* ===== LEFT: FILTRES AMAZON ===== */}
          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                <ShoppingCart className="w-4 h-4 text-orange-500" />
                Filtres Amazon
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">

              {/* Toggles */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Switch
                    checked={filters.exclude_incomplete || false}
                    onCheckedChange={v => update('exclude_incomplete', v)}
                  />
                  Exclure incomplets
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Switch
                    checked={filters.exclude_multipacks || false}
                    onCheckedChange={v => update('exclude_multipacks', v)}
                  />
                  Exclure multipacks
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Switch
                    checked={filters.exclude_hazmat || false}
                    onCheckedChange={v => update('exclude_hazmat', v)}
                  />
                  Exclure Hazmat
                </label>
              </div>

              {/* Marketplace */}
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Marketplace</Label>
                <Select
                  value={filters.marketplace || 'amazon.fr'}
                  onValueChange={v => update('marketplace', v)}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MARKETPLACE_OPTIONS.map(mp => (
                      <SelectItem key={mp.value} value={mp.value}>{mp.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Numeric ranges */}
              <NumericRange
                label="Prix Amazon (€)"
                minVal={filters.amazon_price_min}
                maxVal={filters.amazon_price_max}
                onMinChange={v => update('amazon_price_min', v)}
                onMaxChange={v => update('amazon_price_max', v)}
                step={1}
              />
              <NumericRange
                label="Bénéfice unitaire (€)"
                minVal={filters.unit_profit_min}
                maxVal={filters.unit_profit_max}
                onMinChange={v => update('unit_profit_min', v)}
                onMaxChange={v => update('unit_profit_max', v)}
                step={0.5}
              />
              <NumericRange
                label="ROI unitaire (%)"
                minVal={filters.roi_min}
                maxVal={filters.roi_max}
                onMinChange={v => update('roi_min', v)}
                onMaxChange={v => update('roi_max', v)}
                step={1}
              />
              <NumericRange
                label="Bénéfice mensuel total (€)"
                minVal={filters.monthly_profit_min}
                maxVal={filters.monthly_profit_max}
                onMinChange={v => update('monthly_profit_min', v)}
                onMaxChange={v => update('monthly_profit_max', v)}
                step={10}
              />
              <NumericRange
                label="Ventes mensuelles total"
                minVal={filters.monthly_sales_min}
                maxVal={filters.monthly_sales_max}
                onMinChange={v => update('monthly_sales_min', v)}
                onMaxChange={v => update('monthly_sales_max', v)}
                step={1}
              />

              {/* ASIN list */}
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Liste ASIN</Label>
                <Textarea
                  placeholder="Collez une liste d'ASIN (un par ligne)..."
                  value={filters.asin_list || ''}
                  onChange={e => update('asin_list', e.target.value || undefined)}
                  className="h-16 text-sm resize-none"
                />
              </div>

              {/* Advanced Amazon */}
              <Accordion type="single" collapsible>
                <AccordionItem value="amazon-advanced" className="border-none">
                  <AccordionTrigger className="py-1 text-xs text-muted-foreground hover:no-underline">
                    <span className="flex items-center gap-1">
                      <SlidersHorizontal className="w-3 h-3" />
                      Filtres avancés Amazon
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">BSR maximum</Label>
                      <Input
                        type="number"
                        placeholder="100000"
                        value={filters.bsr_max ?? ''}
                        onChange={e => update('bsr_max', e.target.value ? Number(e.target.value) : undefined)}
                        className="h-8 text-sm"
                        min={0}
                        step={1000}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">Catégorie</Label>
                      <Select
                        value={filters.category || 'all'}
                        onValueChange={v => update('category', v === 'all' ? undefined : v)}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Toutes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes</SelectItem>
                          {CATEGORY_OPTIONS.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">Mots-clés</Label>
                      <Input
                        placeholder="lego, drone, écouteurs..."
                        value={filters.keywords || ''}
                        onChange={e => update('keywords', e.target.value || undefined)}
                        className="h-8 text-sm"
                        maxLength={500}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* ===== RIGHT: FILTRES FOURNISSEUR ===== */}
          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                <Truck className="w-4 h-4 text-blue-500" />
                Filtres Fournisseur
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">

              {/* Country */}
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Pays</Label>
                <Select
                  value={filters.country || 'all'}
                  onValueChange={v => update('country', v === 'all' ? undefined : v)}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_OPTIONS.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type */}
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Type</Label>
                <Select
                  value={filters.supplier_type || 'all'}
                  onValueChange={v => update('supplier_type', v === 'all' ? undefined : v)}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPLIER_TYPE_OPTIONS.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Supplier multiselect */}
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">
                  Fournisseur(s)
                  {(filters.suppliers?.length || 0) > 0 && (
                    <span className="ml-1 text-primary">({filters.suppliers!.length})</span>
                  )}
                </Label>
                {/* Search + actions */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un fournisseur..."
                      value={supplierSearch}
                      onChange={e => setSupplierSearch(e.target.value)}
                      className="h-8 text-sm pl-8 pr-8"
                    />
                    {supplierSearch && (
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setSupplierSearch('')}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <Button
                    type="button" variant="outline" size="sm" className="text-xs h-8 whitespace-nowrap"
                    onClick={() => update('suppliers', [...filteredSuppliers])}
                  >
                    Tout sél.
                  </Button>
                  <Button
                    type="button" variant="outline" size="sm" className="text-xs h-8 whitespace-nowrap"
                    onClick={() => {
                      if (supplierSearch.trim()) {
                        const toRemove = new Set(filteredSuppliers);
                        update('suppliers', (filters.suppliers || []).filter(s => !toRemove.has(s)));
                      } else {
                        update('suppliers', []);
                      }
                    }}
                  >
                    Désélect.
                  </Button>
                </div>
                {/* Scrollable list */}
                <div className="border rounded-md bg-background max-h-[200px] overflow-y-auto">
                  {filteredSuppliers.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-3">Aucun fournisseur trouvé</p>
                  ) : (
                    filteredSuppliers.map(s => (
                      <label
                        key={s}
                        className="flex items-center gap-2 px-2 py-1 text-xs cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={filters.suppliers?.includes(s) || false}
                          onCheckedChange={() => toggleSupplier(s)}
                          className="h-3.5 w-3.5"
                        />
                        <span className="truncate">{s}</span>
                      </label>
                    ))
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {filteredSuppliers.length} fournisseur(s) affiché(s) sur {SUPPLIER_OPTIONS.length}
                </p>
              </div>

              {/* Supplier price */}
              <NumericRange
                label="Prix fournisseur TVA incl. (€)"
                minVal={filters.supplier_price_min}
                maxVal={filters.supplier_price_max}
                onMinChange={v => update('supplier_price_min', v)}
                onMaxChange={v => update('supplier_price_max', v)}
                step={1}
              />

              {/* Updated recently */}
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Mis à jour récemment</Label>
                <Select
                  value={filters.updated_recently || 'all'}
                  onValueChange={v => update('updated_recently', v === 'all' ? undefined : v)}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UPDATED_RECENTLY_OPTIONS.map(o => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* EAN/UPC list */}
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Liste EAN / UPC</Label>
                <Textarea
                  placeholder="Collez une liste d'EAN ou UPC (un par ligne)..."
                  value={filters.ean_list || ''}
                  onChange={e => update('ean_list', e.target.value || undefined)}
                  className="h-16 text-sm resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===== ACTION BAR ===== */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <Button type="submit" disabled={isSearching} size="sm" className="gap-2">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {isSearching ? 'Recherche...' : 'Rechercher'}
          </Button>

          <Button type="button" variant="outline" size="sm" className="gap-2"
            onClick={() => setShowLoadModal(true)} disabled={presets.length === 0}>
            <FolderOpen className="w-4 h-4" />
            Charger filtres
            {presets.length > 0 && (
              <span className="text-xs text-muted-foreground">({presets.length})</span>
            )}
          </Button>

          <Button type="button" variant="outline" size="sm" className="gap-2"
            onClick={() => setShowSaveModal(true)}>
            <Save className="w-4 h-4" />
            Sauvegarder filtres
          </Button>

          <Button type="button" variant="ghost" size="sm" className="gap-2 text-muted-foreground"
            onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
            Effacer
          </Button>
        </div>
      </form>

      {/* ===== SAVE MODAL ===== */}
      <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sauvegarder les filtres</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label>Nom du filtre</Label>
              <Input
                placeholder="Ex: ROI 30%+ Jouets France"
                value={presetName}
                onChange={e => setPresetName(e.target.value)}
                maxLength={200}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowSaveModal(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!presetName.trim()}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== LOAD MODAL ===== */}
      <Dialog open={showLoadModal} onOpenChange={setShowLoadModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Charger des filtres</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2 max-h-[300px] overflow-y-auto">
            {presets.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun filtre sauvegardé
              </p>
            ) : (
              presets.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded-md border hover:bg-muted/50 transition-colors">
                  <button
                    type="button"
                    className="text-sm font-medium text-left flex-1"
                    onClick={() => handleLoadPreset(p)}
                  >
                    {p.name}
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-destructive hover:text-destructive"
                    onClick={() => onDeletePreset(p.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
