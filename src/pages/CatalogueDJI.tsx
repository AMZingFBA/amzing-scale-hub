import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { djiCatalogueProducts, getStockBadgeColor, DJIProduct } from '@/lib/dji-catalogue-data';
import { ShoppingCart, Plus, Minus, Trash2, Send, Search, Package, Euro, Barcode } from 'lucide-react';

interface CartItem {
  product: DJIProduct;
  quantity: number;
}

const CatalogueDJI = () => {
  const { user, isVIP } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockFilter, setStockFilter] = useState<string>('all');

  const filteredProducts = djiCatalogueProducts.filter(product => {
    const matchesSearch = product.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.ean.includes(searchTerm) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (stockFilter === 'all') return matchesSearch;
    if (stockFilter === 'inStock') return matchesSearch && product.stock === 'EN STOCK';
    if (stockFilter === 'soon') return matchesSearch && product.stock !== 'EN STOCK';
    return matchesSearch;
  });

  const addToCart = (product: DJIProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast({
      title: "✓ Ajouté au panier",
      description: product.designation,
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const totalHT = cart.reduce((sum, item) => sum + item.product.prixAchatHT * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const submitOrder = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour passer commande",
        variant: "destructive"
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des produits à votre panier",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format order details for the ticket
      const orderLines = cart.map(item => 
        `• ${item.quantity}x ${item.product.designation} (Réf: ${item.product.id}) - ${(item.product.prixAchatHT * item.quantity).toFixed(2)}€ HT`
      ).join('\n');

      const orderSummary = `
📦 COMMANDE CATALOGUE DJI
═══════════════════════════════════

${orderLines}

═══════════════════════════════════
💰 TOTAL HT: ${totalHT.toFixed(2)}€
📊 Nombre d'articles: ${totalItems}
═══════════════════════════════════

Détails techniques pour traitement:
${cart.map(item => `[${item.product.id}] EAN: ${item.product.ean} | Qté: ${item.quantity} | Réf: ${item.product.reference}`).join('\n')}
      `.trim();

      // Create ticket with special category for DJI orders
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          user_id: user.id,
          subject: `🎯 COMMANDE DJI - ${totalItems} article(s) - ${totalHT.toFixed(2)}€ HT`,
          category: 'catalogue_exclusif',
          subcategory: 'dji',
          priority: 'high',
          status: 'open'
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      // Add message with order details
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          ticket_id: ticket.id,
          user_id: user.id,
          content: orderSummary
        });

      if (messageError) throw messageError;

      toast({
        title: "✅ Commande envoyée !",
        description: "Votre demande a été transmise à l'équipe. Nous vous contacterons rapidement.",
      });

      setCart([]);
      setIsCartOpen(false);
      navigate(`/ticket/${ticket.id}`);

    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la commande. Réessayez.",
        variant: "destructive"
      });
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
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Package className="w-8 h-8 text-primary" />
                Catalogue DJI
              </h1>
              <p className="text-muted-foreground mt-1">
                {djiCatalogueProducts.length} produits disponibles
              </p>
            </div>

            {/* Cart Button */}
            <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="relative">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Panier
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Votre panier ({totalItems} articles)
                  </DialogTitle>
                  <DialogDescription>
                    Vérifiez votre commande avant de l'envoyer
                  </DialogDescription>
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
                        <Card key={item.product.id} className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.product.designation}</p>
                              <p className="text-sm text-muted-foreground">
                                Réf: {item.product.id} • {item.product.prixAchatHT.toFixed(2)}€ HT/u
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.product.id, -1)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.product.id, 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => removeFromCart(item.product.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="font-bold w-24 text-right">
                              {(item.product.prixAchatHT * item.quantity).toFixed(2)}€
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}

                {cart.length > 0 && (
                  <DialogFooter className="flex-col sm:flex-row gap-4 border-t pt-4">
                    <div className="flex-1">
                      <p className="text-lg font-bold">
                        Total HT: {totalHT.toFixed(2)}€
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {totalItems} article(s)
                      </p>
                    </div>
                    <Button
                      size="lg"
                      onClick={submitOrder}
                      disabled={isSubmitting}
                      className="gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {isSubmitting ? 'Envoi...' : 'Passer commande'}
                    </Button>
                  </DialogFooter>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, EAN ou référence..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={stockFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStockFilter('all')}
                  >
                    Tous
                  </Button>
                  <Button
                    variant={stockFilter === 'inStock' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStockFilter('inStock')}
                  >
                    En stock
                  </Button>
                  <Button
                    variant={stockFilter === 'soon' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStockFilter('soon')}
                  >
                    Bientôt
                  </Button>
                </div>
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
                      <TableHead className="w-[100px]">Réf.</TableHead>
                      <TableHead>Désignation</TableHead>
                      <TableHead className="hidden md:table-cell">EAN</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Prix HT</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">PVMC</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-xs">{product.id}</TableCell>
                        <TableCell>
                          <p className="font-medium">{product.designation}</p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            <Barcode className="w-3 h-3 inline mr-1" />
                            {product.ean}
                          </p>
                        </TableCell>
                        <TableCell className="font-mono text-xs hidden md:table-cell">
                          {product.ean}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStockBadgeColor(product.stock)}>
                            {product.stock}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {product.prixAchatHT.toFixed(2)}€
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground hidden sm:table-cell">
                          {product.pvmc.toFixed(2)}€
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                            className="gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Ajouter</span>
                          </Button>
                        </TableCell>
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
    </div>
  );
};

export default CatalogueDJI;
