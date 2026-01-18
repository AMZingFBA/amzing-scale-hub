import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Package, Euro, Barcode, ArrowLeft, Loader2, Upload, Trash2, Database, ChevronLeft, ChevronRight } from 'lucide-react';

interface EanyProduct {
  id: string;
  ean: string;
  brand: string;
  price_ht: number;
}

const PRODUCTS_PER_PAGE = 50;

const CatalogueEany = () => {
  const { user, isVIP, isLoading: authLoading } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [products, setProducts] = useState<EanyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [brands, setBrands] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState('');
  
  // Admin upload
  const [isUploading, setIsUploading] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load all brands using the optimized function
  useEffect(() => {
    const loadBrands = async () => {
      const { data, error } = await supabase.rpc('get_eany_brands');

      if (!error && data) {
        setBrands(data.map((d: { brand: string }) => d.brand));
      }
    };
    loadBrands();
  }, []);

  // Filter brands for display in dropdown
  const filteredBrands = useMemo(() => {
    if (!brandSearch) return brands.slice(0, 200);
    return brands.filter(b => 
      b.toLowerCase().includes(brandSearch.toLowerCase())
    ).slice(0, 200);
  }, [brands, brandSearch]);

  // Load products with pagination and filters
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      
      let query = supabase
        .from('eany_catalogue')
        .select('*', { count: 'exact' });

      // Apply filters
      if (debouncedSearch) {
        query = query.or(`ean.ilike.%${debouncedSearch}%,brand.ilike.%${debouncedSearch}%`);
      }
      
      if (brandFilter && brandFilter !== 'all') {
        query = query.eq('brand', brandFilter);
      }

      // Pagination
      const from = (currentPage - 1) * PRODUCTS_PER_PAGE;
      const to = from + PRODUCTS_PER_PAGE - 1;
      
      query = query
        .order('brand')
        .order('ean')
        .range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les produits",
          variant: "destructive"
        });
      } else {
        setProducts(data || []);
        setTotalCount(count || 0);
      }
      
      setIsLoading(false);
    };

    if (user) {
      loadProducts();
    }
  }, [user, debouncedSearch, brandFilter, currentPage]);

  // Admin: Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    toast({
      title: "📤 Import en cours...",
      description: "Lecture du fichier CSV/JSON..."
    });

    try {
      const text = await file.text();
      let products: any[] = [];

      if (file.name.endsWith('.json')) {
        products = JSON.parse(text);
      } else {
        // CSV parsing
        const lines = text.split('\n').filter(l => l.trim());
        const hasHeader = isNaN(Number(lines[0]?.split(/[,;\t]/)[0]?.trim()));
        const startIndex = hasHeader ? 1 : 0;

        for (let i = startIndex; i < lines.length; i++) {
          const parts = lines[i].split(/[,;\t]/);
          if (parts.length >= 3) {
            products.push({
              ean: parts[0]?.trim().replace(/"/g, ''),
              brand: parts[1]?.trim().replace(/"/g, ''),
              price_ht: parseFloat(parts[2]?.trim().replace(',', '.').replace(/"/g, '')) || 0
            });
          }
        }
      }

      toast({
        title: "📤 Envoi au serveur...",
        description: `${products.length} produits à importer...`
      });

      // Send to edge function in batches
      const batchSize = 5000;
      let totalInserted = 0;

      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        
        const { data, error } = await supabase.functions.invoke('sync-eany-catalogue', {
          body: { products: batch }
        });

        if (error) {
          console.error('Upload error:', error);
        } else {
          totalInserted += data?.inserted || 0;
        }

        toast({
          title: "📤 Import en cours...",
          description: `${Math.min(i + batchSize, products.length)} / ${products.length} produits traités...`
        });
      }

      toast({
        title: "✅ Import terminé !",
        description: `${totalInserted} produits importés avec succès`
      });

      // Reload products
      setCurrentPage(1);
      window.location.reload();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible d'importer le fichier",
        variant: "destructive"
      });
    }

    setIsUploading(false);
    event.target.value = '';
  };

  // Admin: Clear catalogue
  const handleClearCatalogue = async () => {
    if (!confirm('Êtes-vous sûr de vouloir vider le catalogue Eany ?')) return;

    const { error } = await supabase.functions.invoke('sync-eany-catalogue', {
      body: { action: 'clear' }
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de vider le catalogue",
        variant: "destructive"
      });
    } else {
      toast({
        title: "✅ Catalogue vidé",
        description: "Tous les produits ont été supprimés"
      });
      setProducts([]);
      setTotalCount(0);
    }
  };

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (!isVIP && !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Accès réservé VIP</h1>
          <p className="text-muted-foreground mb-6">Ce catalogue est réservé aux membres VIP.</p>
          <Button onClick={() => navigate('/tarifs')}>Voir les offres</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-6">
        {/* Header with back arrow */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/dashboard')}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              Catalogue Eany
            </h1>
            <p className="text-muted-foreground">
              {totalCount.toLocaleString()} produits disponibles
            </p>
          </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <Card className="mb-6 border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <span className="text-sm font-medium">Admin :</span>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".csv,.json,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <Button variant="outline" size="sm" disabled={isUploading} asChild>
                    <span>
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Importer CSV/JSON
                    </span>
                  </Button>
                </label>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleClearCatalogue}
                  disabled={isUploading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vider catalogue
                </Button>
                <span className="text-xs text-muted-foreground">
                  Format: EAN;Marque;Prix_HT (séparateur: , ; ou tab)
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par EAN ou marque..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={brandFilter} onValueChange={(v) => { setBrandFilter(v); setCurrentPage(1); setBrandSearch(''); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par marque" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <div className="p-2 sticky top-0 bg-background">
                    <Input
                      placeholder="Rechercher une marque..."
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <SelectItem value="all">Toutes les marques ({brands.length})</SelectItem>
                  {filteredBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                  {filteredBrands.length === 200 && (
                    <p className="text-xs text-muted-foreground p-2 text-center">
                      Affichage limité à 200 - utilisez la recherche
                    </p>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun produit trouvé</p>
                {isAdmin && (
                  <p className="text-sm mt-2">Utilisez le bouton "Importer CSV/JSON" pour ajouter des produits</p>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">
                          <div className="flex items-center gap-2">
                            <Barcode className="h-4 w-4" />
                            EAN
                          </div>
                        </TableHead>
                        <TableHead>Marque</TableHead>
                        <TableHead className="text-right w-[120px]">
                          <div className="flex items-center justify-end gap-2">
                            <Euro className="h-4 w-4" />
                            Prix HT
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-mono text-sm">
                            {product.ean}
                          </TableCell>
                          <TableCell>
                            {product.brand ? (
                              <Badge variant="secondary">{product.brand}</Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {product.price_ht.toFixed(2)} €
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between p-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} sur {totalPages} ({totalCount.toLocaleString()} produits)
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default CatalogueEany;
