import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Capacitor } from "@capacitor/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Package, Search, Upload, Trash2, ShoppingCart, MessageCircle, X, Copy, ZoomIn, ChevronLeft, ChevronRight, TriangleAlert, Pencil, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCatalogueUnread } from "@/hooks/use-catalogue-unread";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface CatalogueProduct {
  id: string;
  admin_id: string;
  asin: string | null;
  ean: string | null;
  title: string;
  description: string | null;
  images: string[];
  quantity: number;
  price: number;
  price_type: string;
  status: string;
  created_at: string;
}

const CatalogueProduits = () => {
  const { user, isVIP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useCatalogueUnread();
  const isNativeApp = Capacitor.isNativePlatform();
  
  const [catalogueProducts, setCatalogueProducts] = useState<CatalogueProduct[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Form states
  const [isCreating, setIsCreating] = useState(false);
  const [searchCode, setSearchCode] = useState("");
  const [searchType, setSearchType] = useState<"asin" | "ean">("asin");
  const [isSearching, setIsSearching] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState<"TTC" | "HT">("TTC");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Edit states
  const [editingProduct, setEditingProduct] = useState<CatalogueProduct | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // Quantity dialog states
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CatalogueProduct | null>(null);
  const [requestedQuantity, setRequestedQuantity] = useState(1);
  
  // Image gallery states
  const [selectedImageGallery, setSelectedImageGallery] = useState<string[] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageDialog, setShowImageDialog] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    checkAdmin();
    loadCatalogueProducts();
    loadMyTickets();

    const catalogueChannel = supabase
      .channel("catalogue_products_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "catalogue_products" }, () => {
        loadCatalogueProducts();
      })
      .subscribe();

    const ticketsChannel = supabase
      .channel("catalogue_tickets_changes")
      .on("postgres_changes", { 
        event: "*", 
        schema: "public", 
        table: "tickets",
        filter: `category=eq.gestion_produit`
      }, () => {
        loadMyTickets();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(catalogueChannel);
      supabase.removeChannel(ticketsChannel);
    };
  }, [user, navigate]);

  const checkAdmin = async () => {
    if (!user) return;
    const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    setIsAdmin(data || false);
  };

  const loadCatalogueProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("catalogue_products")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCatalogueProducts(data || []);
    } catch (error: any) {
      console.error("Error loading catalogue products:", error);
      toast.error("Erreur lors du chargement du catalogue");
    } finally {
      setLoading(false);
    }
  };

  const loadMyTickets = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("tickets")
        .select(`
          *,
          messages(id, content, created_at, user_id, file_url, file_name)
        `)
        .eq("user_id", user.id)
        .eq("category", "gestion_produit")
        .eq("subcategory", "catalogue_pro")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyTickets(data || []);
    } catch (error: any) {
      console.error("Error loading marketplace tickets:", error);
    }
  };

  const searchProduct = async () => {
    if (!searchCode.trim()) {
      toast.error("Veuillez entrer un code ASIN ou EAN");
      return;
    }

    setIsSearching(true);
    // Simuler une recherche (à remplacer par une vraie API si nécessaire)
    setTimeout(() => {
      setIsSearching(false);
      toast.info("Recherche effectuée");
    }, 1000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setUploadedFiles([...uploadedFiles, ...newFiles]);

    // Upload to storage
    const urls = await uploadFilesToStorage(newFiles);
    setUploadedImages([...uploadedImages, ...urls]);
  };

  const uploadFilesToStorage = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}/${Math.random()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('marketplace-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('marketplace-images')
          .getPublicUrl(fileName);

        urls.push(publicUrl);
      } catch (error: any) {
        console.error('Error uploading file:', error);
        toast.error(`Erreur lors de l'upload de ${file.name}`);
      }
    }
    
    return urls;
  };

  const createListing = async () => {
    if (!user) return;
    
    if (!title.trim()) {
      toast.error("Le titre du produit est requis");
      return;
    }

    if (!price) {
      toast.error("Le prix est requis");
      return;
    }

    setIsCreating(true);

    try {
      // Créer un produit dans le catalogue (catalogue_products)
      const { error } = await supabase
        .from("catalogue_products")
        .insert({
          admin_id: user.id,
          asin: searchType === "asin" ? searchCode : null,
          ean: searchType === "ean" ? searchCode : null,
          title,
          description: description || null,
          images: uploadedImages,
          quantity,
          price: parseFloat(price),
          price_type: priceType,
          status: "active"
        });

      if (error) throw error;
      toast.success("Produit ajouté au catalogue avec succès!");
      
      await loadCatalogueProducts();
      resetForm();
      setShowCreateDialog(false);
    } catch (error: any) {
      console.error("Error creating catalogue product:", error);
      toast.error("Erreur lors de la création");
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setSearchCode("");
    setTitle("");
    setDescription("");
    setQuantity(1);
    setPrice("");
    setUploadedFiles([]);
    setUploadedImages([]);
  };

  const deleteCatalogueProduct = async (productId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit du catalogue?")) return;

    try {
      const { error } = await supabase
        .from("catalogue_products")
        .update({ status: "removed" })
        .eq("id", productId);

      if (error) throw error;

      toast.success("Produit retiré du catalogue");
      await loadCatalogueProducts();
    } catch (error: any) {
      console.error("Error deleting catalogue product:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const openQuantityDialog = (product: CatalogueProduct) => {
    setSelectedProduct(product);
    setRequestedQuantity(1);
    setShowQuantityDialog(true);
  };

  const handleInterestInProduct = async () => {
    if (!user || !selectedProduct) return;

    // Valider la quantité
    if (requestedQuantity < 1 || requestedQuantity > selectedProduct.quantity) {
      toast.error(`La quantité doit être entre 1 et ${selectedProduct.quantity}`);
      return;
    }

    try {
      const code = selectedProduct.asin || selectedProduct.ean || "N/A";
      
      // Créer un ticket pour catalogue pro avec l'acheteur qui contacte les admins
      const buyerSubject = `Catalogue Pro - ${selectedProduct.title}`;
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          user_id: user.id,
          subject: buyerSubject,
          category: 'gestion_produit',
          subcategory: 'catalogue_pro',
          status: 'open',
          priority: 'normal'
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      // Créer le message initial avec la quantité demandée
      const buyerMessage = `Bonjour 👋
Je suis intéressé(e) par ce produit du catalogue :
- Titre : ${selectedProduct.title}
- Code : ${code}
- Prix : ${selectedProduct.price}€ ${selectedProduct.price_type}
- Quantité souhaitée : ${requestedQuantity}

Est-il toujours disponible ?`;

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          ticket_id: ticket.id,
          user_id: user.id,
          content: buyerMessage
        });

      if (messageError) throw messageError;

      toast.success("Demande d'achat envoyée! Un ticket a été créé.");
      
      setShowQuantityDialog(false);
      setSelectedProduct(null);
      setRequestedQuantity(1);
      await loadMyTickets();
      navigate("/catalogue-produits?tab=tickets");
    } catch (error: any) {
      console.error("Error creating ticket:", error);
      toast.error("Erreur lors de la création de la demande");
    }
  };

  const openEditDialog = (product: CatalogueProduct) => {
    setEditingProduct(product);
    setTitle(product.title);
    setDescription(product.description || "");
    setQuantity(product.quantity);
    setPrice(product.price.toString());
    setPriceType(product.price_type as "TTC" | "HT");
    setSearchCode(product.asin || product.ean || "");
    setSearchType(product.asin ? "asin" : "ean");
    setUploadedImages(product.images || []);
    setShowEditDialog(true);
  };

  const updateProduct = async () => {
    if (!editingProduct || !user) return;
    
    if (!title.trim()) {
      toast.error("Le titre du produit est requis");
      return;
    }

    if (!price) {
      toast.error("Le prix est requis");
      return;
    }

    setIsCreating(true);

    try {
      const { error } = await supabase
        .from("catalogue_products")
        .update({
          asin: searchType === "asin" ? searchCode : null,
          ean: searchType === "ean" ? searchCode : null,
          title,
          description: description || null,
          images: uploadedImages,
          quantity,
          price: parseFloat(price),
          price_type: priceType,
        })
        .eq("id", editingProduct.id);

      if (error) throw error;
      toast.success("Produit modifié avec succès!");
      
      await loadCatalogueProducts();
      resetForm();
      setShowEditDialog(false);
      setEditingProduct(null);
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error("Erreur lors de la modification");
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copié!");
  };

  const openImageGallery = (images: string[], index: number = 0) => {
    setSelectedImageGallery(images);
    setCurrentImageIndex(index);
    setShowImageDialog(true);
  };

  const nextImage = () => {
    if (selectedImageGallery) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedImageGallery.length);
    }
  };

  const prevImage = () => {
    if (selectedImageGallery) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedImageGallery.length) % selectedImageGallery.length);
    }
  };

  const renderCatalogueProduct = (product: CatalogueProduct, isOwn: boolean) => {
    const code = product.asin || product.ean || "N/A";
    const codeType = product.asin ? "ASIN" : product.ean ? "EAN" : "Code";
    const hasImages = product.images && product.images.length > 0;
    
    // Prix du catalogue (pas de majoration, prix direct)
    const displayPrice = product.price;
    
    return (
      <Card key={product.id} className="hover:shadow-xl transition-all animate-fade-in overflow-hidden">
        {hasImages && (
          <div className="p-4">
            <div 
              className="relative cursor-pointer group/image border-2 border-muted rounded-lg overflow-hidden"
              onClick={() => openImageGallery(product.images, 0)}
            >
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/30 transition-all flex items-center justify-center">
                <div className="opacity-0 group-hover/image:opacity-100 transition-opacity">
                  <div className="bg-white rounded-full p-3">
                    <ZoomIn className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>
              {product.images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1.5 rounded-md text-sm font-semibold">
                  +{product.images.length - 1} photo{product.images.length > 2 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        )}
        
        <CardHeader className="space-y-4 pb-3">
          <div className="flex justify-between items-start gap-3">
            <CardTitle className="text-lg font-bold line-clamp-2">
              {product.title}
            </CardTitle>
            <Badge variant="secondary" className="shrink-0 text-base font-bold px-3 py-1.5 whitespace-nowrap">
              {displayPrice}€/u {product.price_type}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 pt-0 pb-4">
          <div 
            className="flex items-center justify-between gap-2 group/code cursor-pointer bg-muted/40 hover:bg-muted/60 px-3 py-2.5 rounded-lg transition-colors border border-muted"
            onClick={() => copyToClipboard(code)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xs font-medium text-muted-foreground shrink-0">{codeType}:</span>
              <code className="font-mono font-bold text-sm truncate">{code}</code>
            </div>
            <Copy className="w-4 h-4 text-muted-foreground group-hover/code:text-primary transition-colors shrink-0" />
          </div>
          
          <div className="flex items-center justify-between bg-primary/5 border border-primary/20 px-3 py-2.5 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">Quantité disponible</span>
            <span className="text-lg font-bold text-primary">{product.quantity} unité{product.quantity > 1 ? 's' : ''}</span>
          </div>

          {!isAdmin && (
            <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 px-3 py-2.5 rounded-lg">
              <TriangleAlert className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                Le prix comprend le produit, les frais de stockage dans nos locaux, les frais d'expédition (cartons, emballage, bordereaux) et le service après-vente.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex gap-2 p-4 pt-0">
          {isAdmin ? (
            <>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => openEditDialog(product)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="lg"
                className="flex-1"
                onClick={() => deleteCatalogueProduct(product.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              className="w-full hover-scale font-semibold"
              onClick={() => openQuantityDialog(product)}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Je veux acheter ce produit
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  if (!isVIP && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Accès VIP requis</CardTitle>
            <CardDescription>
              Le catalogue professionnel est réservé aux membres VIP
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/tarifs")} className="w-full">
              Voir les tarifs
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {isNativeApp && (
        <button
          onClick={() => navigate('/dashboard')}
          className="fixed top-[46px] left-[18px] z-50 bg-primary/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-primary transition-all animate-bounce-subtle"
          aria-label="Retour"
        >
          <ArrowLeft className="w-5 h-5 text-primary-foreground" />
        </button>
      )}
      <main className="flex-grow pt-20 bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Quantity Selection Dialog */}
        <Dialog open={showQuantityDialog} onOpenChange={setShowQuantityDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Quantité souhaitée</DialogTitle>
              <DialogDescription>
                {selectedProduct && (
                  <>
                    Combien d'unités de <strong>{selectedProduct.title}</strong> souhaitez-vous commander ?
                    <br />
                    <span className="text-sm text-muted-foreground mt-2 block">
                      Quantité disponible : {selectedProduct.quantity} unité{selectedProduct.quantity > 1 ? 's' : ''}
                    </span>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedProduct?.quantity || 1}
                  value={requestedQuantity}
                  onChange={(e) => setRequestedQuantity(parseInt(e.target.value) || 1)}
                  className="text-lg font-semibold"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum: 1 • Maximum: {selectedProduct?.quantity || 1}
                </p>
              </div>

              {selectedProduct && (
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prix unitaire</span>
                    <span className="font-semibold">{selectedProduct.price}€ {selectedProduct.price_type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantité</span>
                    <span className="font-semibold">× {requestedQuantity}</span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Total estimé</span>
                      <span className="text-lg font-bold text-primary">
                        {(selectedProduct.price * requestedQuantity).toFixed(2)}€ {selectedProduct.price_type}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowQuantityDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleInterestInProduct}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Confirmer la demande
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Image Gallery Dialog */}
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogContent className="max-w-4xl p-0">
            <div className="relative">
              {selectedImageGallery && selectedImageGallery.length > 0 && (
                <>
                  <img
                    src={selectedImageGallery[currentImageIndex]}
                    alt={`Image ${currentImageIndex + 1}`}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                  
                  {selectedImageGallery.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                        onClick={nextImage}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </Button>
                      
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {currentImageIndex + 1} / {selectedImageGallery.length}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            
            {selectedImageGallery && selectedImageGallery.length > 1 && (
              <div className="p-4 bg-muted/30">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedImageGallery.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-all ${
                        idx === currentImageIndex 
                          ? 'ring-2 ring-primary scale-110' 
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      onClick={() => setCurrentImageIndex(idx)}
                    />
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Catalogue Section */}
        <div className="w-full space-y-6 animate-fade-in">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Catalogue Pro — Mes produits
            </h1>
            <p className="text-muted-foreground mt-2">
              Découvrez tous les produits disponibles à la vente pour les professionnels.
              <br />
              Chaque article est stocké, expédié et géré directement par notre équipe (SAV inclus)
            </p>
          </div>

          {/* Create/Edit Product Dialog - Admin Only */}
          {isAdmin && (
            <>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full md:w-auto hover-scale">
                    <Package className="w-5 h-5 mr-2" />
                    Ajouter un produit au catalogue
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Ajouter un produit au catalogue
                  </DialogTitle>
                  <DialogDescription>
                    Ajoutez un nouveau produit au catalogue professionnel. Ce produit sera stocké, expédié et géré par notre équipe.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Select value={searchType} onValueChange={(v: any) => setSearchType(v)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asin">ASIN</SelectItem>
                        <SelectItem value="ean">EAN</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder={searchType === "asin" ? "Ex: B08N5WRWNW" : "Ex: 1234567890123"}
                      value={searchCode}
                      onChange={(e) => setSearchCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={searchProduct} disabled={isSearching}>
                      {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Titre du produit *</Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: iPhone 15 Pro, Nike Air Max..."
                      />
                    </div>

                    <div>
                      <Label>Photos du produit (optionnel)</Label>
                      <p className="text-xs text-muted-foreground mb-2">Ajoutez une ou plusieurs photos du produit</p>
                      <div className="mt-2">
                        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="text-center">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Cliquez pour uploader des photos
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPG, WEBP acceptés
                            </p>
                          </div>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      
                      {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-3">
                          {uploadedImages.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-24 object-cover rounded-lg border-2 border-muted" />
                              <button
                                onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                type="button"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Quantité *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div>
                        <Label>Prix *</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                          <Select value={priceType} onValueChange={(v: any) => setPriceType(v)}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TTC">TTC</SelectItem>
                              <SelectItem value="HT">HT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setShowCreateDialog(false);
                    resetForm();
                  }}>
                    Annuler
                  </Button>
                  <Button onClick={createListing} disabled={isCreating}>
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Package className="w-4 h-4 mr-2" />}
                    Ajouter au catalogue
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Modifier le produit
                  </DialogTitle>
                  <DialogDescription>
                    Modifiez les informations du produit dans le catalogue professionnel.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Select value={searchType} onValueChange={(v: any) => setSearchType(v)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asin">ASIN</SelectItem>
                        <SelectItem value="ean">EAN</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder={searchType === "asin" ? "Ex: B08N5WRWNW" : "Ex: 1234567890123"}
                      value={searchCode}
                      onChange={(e) => setSearchCode(e.target.value)}
                      className="flex-1"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Titre du produit *</Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: iPhone 15 Pro, Nike Air Max..."
                      />
                    </div>

                    <div>
                      <Label>Photos du produit (optionnel)</Label>
                      <p className="text-xs text-muted-foreground mb-2">Ajoutez une ou plusieurs photos du produit</p>
                      <div className="mt-2">
                        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="text-center">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Cliquez pour uploader des photos
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPG, WEBP acceptés
                            </p>
                          </div>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      
                      {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-3">
                          {uploadedImages.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-24 object-cover rounded-lg border-2 border-muted" />
                              <button
                                onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                type="button"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Quantité *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div>
                        <Label>Prix *</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                          <Select value={priceType} onValueChange={(v: any) => setPriceType(v)}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TTC">TTC</SelectItem>
                              <SelectItem value="HT">HT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setShowEditDialog(false);
                    setEditingProduct(null);
                    resetForm();
                  }}>
                    Annuler
                  </Button>
                  <Button onClick={updateProduct} disabled={isCreating}>
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Pencil className="w-4 h-4 mr-2" />}
                    Enregistrer les modifications
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
          )}

          {/* Tabs for catalogue and my requests */}
          <Tabs defaultValue={new URLSearchParams(location.search).get('tab') || "all"} className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-2 p-1 bg-muted/50 rounded-lg">
              <TabsTrigger value="all" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                Notre catalogue
              </TabsTrigger>
              <TabsTrigger value="tickets" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all relative">
                Mes demandes
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6 animate-fade-in">
              {catalogueProducts.length === 0 ? (
                <Card className="p-16 border-2 border-dashed border-muted-foreground/20 bg-muted/5">
                  <div className="text-center text-muted-foreground space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 rounded-full bg-muted/30">
                        <Package className="w-12 h-12 opacity-50" />
                      </div>
                    </div>
                    <p className="text-lg font-medium">Aucun produit disponible pour le moment</p>
                    <p className="text-sm">Les produits seront ajoutés prochainement par notre équipe</p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catalogueProducts.map(product => renderCatalogueProduct(product, false))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="tickets" className="mt-6 animate-fade-in">
              <div className="space-y-6">
                {/* Notification Banner */}
                {unreadCount > 0 && (
                  <Card className="bg-gradient-to-r from-amber-50 via-amber-50/50 to-transparent dark:from-amber-950/20 dark:via-amber-950/10 dark:to-transparent border-l-4 border-l-amber-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                          <Package className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base mb-1 text-amber-900 dark:text-amber-100">
                            {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''} message{unreadCount > 1 ? 's' : ''}
                          </CardTitle>
                          <CardDescription className="text-sm text-amber-700 dark:text-amber-300">
                            Catégorie: Gestion Produits • Sous-catégorie: Catalogue Pro
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                )}

                {myTickets.length === 0 ? (
                  <Card className="p-16 border-2 border-dashed border-muted-foreground/20 bg-muted/5">
                    <div className="text-center text-muted-foreground space-y-4">
                      <div className="flex justify-center">
                        <div className="p-4 rounded-full bg-muted/30">
                          <MessageCircle className="w-12 h-12 opacity-50" />
                        </div>
                      </div>
                      <p className="text-lg font-medium">Aucune demande pour le moment</p>
                      <p className="text-sm">Lorsque vous demanderez un produit, les tickets apparaîtront ici</p>
                    </div>
                  </Card>
                ) : (
                  <Tabs defaultValue="open" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                      <TabsTrigger value="open">
                        En cours ({myTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length})
                      </TabsTrigger>
                      <TabsTrigger value="closed">
                        Fermés ({myTickets.filter(t => t.status === 'closed').length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="open" className="mt-4">
                      {myTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length === 0 ? (
                        <Card className="p-12 border-2 border-dashed border-muted-foreground/20 bg-muted/5">
                          <div className="text-center text-muted-foreground">
                            <p className="text-sm">Aucune demande en cours</p>
                          </div>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {myTickets
                            .filter(t => t.status === 'open' || t.status === 'in_progress')
                            .map((ticket) => (
                              <Card
                                key={ticket.id}
                                className="hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => {
                                  navigate(`/ticket/${ticket.id}`);
                                }}
                              >
                                <CardHeader className="pb-3">
                                  <div className="flex justify-between items-start gap-2">
                                    <CardTitle className="text-sm font-semibold line-clamp-2">
                                      {ticket.subject}
                                    </CardTitle>
                                    <Badge variant={ticket.status === "open" ? "default" : "secondary"}>
                                      {ticket.status}
                                    </Badge>
                                  </div>
                                  <CardDescription className="text-xs">
                                    {new Date(ticket.created_at).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </CardDescription>
                                </CardHeader>
                              </Card>
                            ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="closed" className="mt-4">
                      {myTickets.filter(t => t.status === 'closed').length === 0 ? (
                        <Card className="p-12 border-2 border-dashed border-muted-foreground/20 bg-muted/5">
                          <div className="text-center text-muted-foreground">
                            <p className="text-sm">Aucune demande fermée</p>
                          </div>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {myTickets
                            .filter(t => t.status === 'closed')
                            .map((ticket) => (
                              <Card
                                key={ticket.id}
                                className="hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => {
                                  navigate(`/ticket/${ticket.id}`);
                                }}
                              >
                                <CardHeader className="pb-3">
                                  <div className="flex justify-between items-start gap-2">
                                    <CardTitle className="text-sm font-semibold line-clamp-2">
                                      {ticket.subject}
                                    </CardTitle>
                                    <Badge variant="outline">
                                      closed
                                    </Badge>
                                  </div>
                                  <CardDescription className="text-xs">
                                    {new Date(ticket.created_at).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </CardDescription>
                                </CardHeader>
                              </Card>
                            ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default CatalogueProduits;
