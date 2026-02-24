import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { franceHexagoneCatalogueProducts, FranceHexagoneProduct } from '@/lib/france-hexagone-catalogue-data';
import { useCatalogueAdminEdit } from '@/hooks/use-catalogue-admin-edit';
import CatalogueEditDialog, { EditField } from '@/components/CatalogueEditDialog';
import { ShoppingCart, Plus, Minus, Trash2, Send, Search, Package, ArrowLeft, Barcode, Pencil, RotateCcw } from 'lucide-react';

interface CartItem {
  product: FranceHexagoneProduct;
  quantity: number;
}

const editFields: EditField[] = [
  { key: 'nom', label: 'Nom du produit', type: 'text' },
  { key: 'ean', label: 'EAN', type: 'text' },
  { key: 'prixTTC', label: 'Prix TTC (€)', type: 'number' },
  { key: 'quantite', label: 'Quantité', type: 'number' },
];

const CatalogueFranceHexagone = () => {
  const { user, isVIP } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editProduct, setEditProduct] = useState<FranceHexagoneProduct | null>(null);

  const { products, isAdmin, updateProduct, deleteProduct, resetToDefault } = useCatalogueAdminEdit<FranceHexagoneProduct>(
    'france-hexagone', franceHexagoneCatalogueProducts, 'ean'
  );

  const filteredProducts = products.filter(product =>
    product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.ean.includes(searchTerm)
  );

  const addToCart = (product: FranceHexagoneProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.ean === product.ean);
      if (existing) {
        const newQty = Math.min(existing.quantity + 1, product.quantite);
        return prev.map(item =>
          item.product.ean === product.ean ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast({ title: "✓ Ajouté au panier", description: product.nom });
  };

  const updateQuantity = (ean: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.product.ean === ean
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (ean: string) => {
    setCart(prev => prev.filter(item => item.product.ean !== ean));
  };

  const totalTTC = cart.reduce((sum, item) => sum + item.product.prixTTC * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleDelete = (ean: string) => {
    deleteProduct(ean);
    removeFromCart(ean);
    toast({ title: "Produit supprimé", description: "Le produit a été retiré du catalogue." });
  };

  const submitOrder = async () => {
    if (!user) {
      toast({ title: "Erreur", description: "Vous devez être connecté pour passer commande", variant: "destructive" });
      return;
    }
    if (cart.length === 0) {
      toast({ title: "Panier vide", description: "Ajoutez des produits à votre panier", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const orderLines = cart.map(item =>
        `• ${item.quantity}x ${item.product.nom} (EAN: ${item.product.ean}) - ${(item.product.prixTTC * item.quantity).toFixed(2)}€ TTC`
      ).join('\n');

      const orderSummary = `
📦 COMMANDE CATALOGUE FRANCE HEXAGONE
═══════════════════════════════════
${orderLines}
═══════════════════════════════════
💰 TOTAL TTC: ${totalTTC.toFixed(2)}€
📊 Nombre d'articles: ${totalItems}
═══════════════════════════════════
Détails techniques:
${cart.map(item => `EAN: ${item.product.ean} | Qté: ${item.quantity}`).join('\n')}
      `.trim();

      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          user_id: user.id,
          subject: `🇫🇷 COMMANDE FRANCE HEXAGONE - ${totalItems} article(s) - ${totalTTC.toFixed(2)}€ TTC`,
          category: 'catalogue_exclusif',
          subcategory: 'france-hexagone',
          priority: 'high',
          status: 'open'
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      const { error: messageError } = await supabase
        .from('messages')
        .insert({ ticket_id: ticket.id, user_id: user.id, content: orderSummary });

      if (messageError) throw messageError;

      toast({ title: "✅ Commande envoyée !", description: "Votre demande a été transmise à l'équipe." });
      setCart([]);
      setIsCartOpen(false);
      navigate(`/ticket/${ticket.id}`);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({ title: "Erreur", description: "Impossible d'envoyer la commande. Réessayez.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVIP) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-bold mb-2">Accès VIP requis</h2>
              <p className="text-muted-foreground">Ce catalogue est réservé aux membres VIP.</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
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
                <Package className="w-6 h-6 text-primary" />
                Catalogue France Hexagone
              </h1>
            </div>
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={resetToDefault} className="gap-1 text-xs">
                <RotateCcw className="w-3 h-3" />
                Réinitialiser
              </Button>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <p className="text-muted-foreground">{products.length} produits disponibles</p>

            <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="relative">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Panier
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">{totalItems}</Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Votre panier ({totalItems} articles)
                  </DialogTitle>
                  <DialogDescription>Vérifiez votre commande avant de l'envoyer</DialogDescription>
                </DialogHeader>

                {cart.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Votre panier est vide</p>
                  </div>
                ) : (
                  <ScrollArea className="max-h-[400px]">
                    <div className="space-y-3">
                      {cart.map(item => (
                        <Card key={item.product.ean} className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.product.nom}</p>
                              <p className="text-sm text-muted-foreground">EAN: {item.product.ean} • {item.product.prixTTC.toFixed(2)}€ TTC/u</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.ean, -1)}>
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.ean, 1)}>
                                <Plus className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFromCart(item.product.ean)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="font-bold w-24 text-right">{(item.product.prixTTC * item.quantity).toFixed(2)}€</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}

                {cart.length > 0 && (
                  <DialogFooter className="flex-col sm:flex-row gap-4 border-t pt-4">
                    <div className="flex-1">
                      <p className="text-lg font-bold">Total TTC: {totalTTC.toFixed(2)}€</p>
                      <p className="text-sm text-muted-foreground">{totalItems} article(s)</p>
                    </div>
                    <Button size="lg" onClick={submitOrder} disabled={isSubmitting} className="gap-2">
                      <Send className="w-4 h-4" />
                      {isSubmitting ? 'Envoi...' : 'Passer commande'}
                    </Button>
                  </DialogFooter>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou EAN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                      <TableHead>EAN</TableHead>
                      <TableHead>Nom produit</TableHead>
                      <TableHead className="text-right">Prix TTC</TableHead>
                      <TableHead className="text-right">Quantité</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                      {isAdmin && <TableHead className="w-[80px]">Admin</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.ean} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-xs">
                          <span className="hidden md:inline">{product.ean}</span>
                          <span className="md:hidden flex items-center gap-1">
                            <Barcode className="w-3 h-3" />
                            {product.ean}
                          </span>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{product.nom}</p>
                        </TableCell>
                        <TableCell className="text-right font-bold">{product.prixTTC.toFixed(2)}€</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={product.quantite > 10 ? 'border-green-500 text-green-600' : product.quantite > 0 ? 'border-orange-500 text-orange-600' : 'border-red-500 text-red-600'}>
                            {product.quantite}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => addToCart(product)} className="gap-1">
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Ajouter</span>
                          </Button>
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditProduct(product)}>
                                <Pencil className="w-3.5 h-3.5 text-primary" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(product.ean)}>
                                <Trash2 className="w-3.5 h-3.5 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun produit trouvé</p>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <CatalogueEditDialog
        open={!!editProduct}
        onOpenChange={(open) => !open && setEditProduct(null)}
        product={editProduct}
        fields={editFields}
        idField="ean"
        onSave={(id, updates) => {
          updateProduct(id, updates);
          toast({ title: "✅ Produit modifié", description: "Les changements ont été enregistrés." });
        }}
      />
    </div>
  );
};

export default CatalogueFranceHexagone;
