import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Upload, Trash2, Package, MessageCircle, X, ZoomIn, ChevronLeft, ChevronRight, Edit, Search, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMarketplaceUnread } from "@/hooks/use-marketplace-unread";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Listing {
  id: string;
  user_id: string;
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

const WantToSell = () => {
  const { user, isVIP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useMarketplaceUnread();
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Form states
  const [isCreating, setIsCreating] = useState(false);
  const [searchCode, setSearchCode] = useState("");
  const [searchType, setSearchType] = useState<"asin" | "ean">("asin");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState<"TTC" | "HT">("TTC");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  
  // Image gallery states
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImageGallery, setSelectedImageGallery] = useState<string[] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Success banner state
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    checkAdmin();
    loadListings();
    loadMyListings();
    loadMyTickets();

    const listingsChannel = supabase
      .channel("marketplace_listings_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "marketplace_listings" }, () => {
        loadListings();
        loadMyListings();
      })
      .subscribe();

    const ticketsChannel = supabase
      .channel("marketplace_tickets_changes")
      .on("postgres_changes", { 
        event: "*", 
        schema: "public", 
        table: "tickets",
        filter: `category=eq.marketplace`
      }, () => {
        loadMyTickets();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(listingsChannel);
      supabase.removeChannel(ticketsChannel);
    };
  }, [user, navigate]);

  const checkAdmin = async () => {
    if (!user) return;
    const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    setIsAdmin(data || false);
  };

  const loadListings = async () => {
    try {
      const { data, error } = await supabase
        .from("marketplace_listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error: any) {
      console.error("Error loading listings:", error);
      toast.error("Erreur lors du chargement des annonces");
    } finally {
      setLoading(false);
    }
  };

  const loadMyListings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("marketplace_listings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false});

      if (error) throw error;
      setMyListings(data || []);
    } catch (error: any) {
      console.error("Error loading my listings:", error);
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
        .eq("category", "marketplace")
        .eq("subcategory", "sell")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyTickets(data || []);
    } catch (error: any) {
      console.error("Error loading marketplace tickets:", error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
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
      if (editingListing) {
        // Mise à jour d'une annonce existante
        const { error } = await supabase
          .from("marketplace_listings")
          .update({
            asin: searchType === "asin" ? searchCode : null,
            ean: searchType === "ean" ? searchCode : null,
            title,
            description,
            images: uploadedImages,
            quantity,
            price: parseFloat(price),
            price_type: priceType,
          })
          .eq("id", editingListing.id);

        if (error) throw error;
        toast.success("Annonce modifiée avec succès!");
        
        setEditingListing(null);
        await loadMyListings();
      } else {
        // Créer une nouvelle annonce
        const { error } = await supabase
          .from("marketplace_listings")
          .insert({
            user_id: user.id,
            asin: searchType === "asin" ? searchCode : null,
            ean: searchType === "ean" ? searchCode : null,
            title,
            description,
            images: uploadedImages,
            quantity,
            price: parseFloat(price),
            price_type: priceType,
            status: "active"
          });

        if (error) throw error;
        toast.success("Annonce de vente créée avec succès!");
        
        await loadMyListings();
      }
      
      resetForm();
      setShowCreateDialog(false);
    } catch (error: any) {
      console.error("Error creating listing:", error);
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
    setUploadedImages([]);
    setEditingListing(null);
  };

  const editListing = (listing: Listing) => {
    setEditingListing(listing);
    setSearchType(listing.asin ? "asin" : "ean");
    setSearchCode(listing.asin || listing.ean || "");
    setTitle(listing.title);
    setDescription(listing.description || "");
    setQuantity(listing.quantity);
    setPrice(listing.price.toString());
    setPriceType(listing.price_type as "TTC" | "HT");
    setUploadedImages(listing.images || []);
    setShowCreateDialog(true);
  };

  const handleInterestInListing = async (listing: Listing) => {
    if (!user) return;

    if (listing.user_id === user.id) {
      toast.error("Vous ne pouvez pas acheter votre propre annonce!");
      return;
    }

    try {
      const code = listing.asin || listing.ean || "N/A";
      
      const { data, error } = await supabase.functions.invoke('create-sell-tickets', {
        body: {
          listingId: listing.id,
          listingTitle: listing.title,
          listingCode: code,
          listingQuantity: listing.quantity,
          listingPrice: listing.price,
          listingPriceType: listing.price_type,
          listingUserId: listing.user_id,
          buyerUserId: user.id
        }
      });

      if (error) throw error;

      // Show success banner
      setShowSuccessBanner(true);
      
      // Hide banner after 5 seconds
      setTimeout(() => setShowSuccessBanner(false), 5000);
      
      await loadMyTickets();
      
      // Redirect to tickets tab
      navigate("/vendre?tab=tickets");
    } catch (error: any) {
      console.error("Error creating tickets:", error);
      toast.error("Erreur lors de la création de la demande");
    }
  };

  const deleteListing = async (listingId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette annonce?")) return;

    try {
      const { error } = await supabase
        .from("marketplace_listings")
        .update({ status: "removed" })
        .eq("id", listingId);

      if (error) throw error;

      toast.success("Annonce supprimée");
      await loadListings();
      await loadMyListings();
    } catch (error: any) {
      console.error("Error deleting listing:", error);
      toast.error("Erreur lors de la suppression");
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

  const renderListing = (listing: Listing, isOwn: boolean) => {
    const code = listing.asin || listing.ean || "N/A";
    const codeType = listing.asin ? "ASIN" : listing.ean ? "EAN" : "Code";
    const hasImages = listing.images && listing.images.length > 0;
    
    // Calculer le prix affiché : +15% pour les acheteurs, prix original pour le vendeur
    const displayPrice = isOwn 
      ? listing.price 
      : (Number(listing.price) * 1.15).toFixed(2);
    
    return (
      <Card key={listing.id} className="hover:shadow-xl transition-all animate-fade-in overflow-hidden">
        {hasImages && (
          <div className="p-4">
            <div 
              className="relative cursor-pointer group/image border-2 border-muted rounded-lg overflow-hidden"
              onClick={() => openImageGallery(listing.images, 0)}
            >
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/30 transition-all flex items-center justify-center">
                <div className="opacity-0 group-hover/image:opacity-100 transition-opacity">
                  <div className="bg-white rounded-full p-3">
                    <ZoomIn className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>
              {listing.images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1.5 rounded-md text-sm font-semibold">
                  +{listing.images.length - 1} photo{listing.images.length > 2 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        )}
        
        <CardHeader className="space-y-4 pb-3">
          <div className="flex justify-between items-start gap-3">
            <CardTitle className="text-lg font-bold line-clamp-2">
              {listing.title}
            </CardTitle>
            <Badge variant="secondary" className="shrink-0 text-base font-bold px-3 py-1.5 whitespace-nowrap">
              {displayPrice}€/u {listing.price_type}
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
            <span className="text-lg font-bold text-primary">{listing.quantity} unité{listing.quantity > 1 ? 's' : ''}</span>
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2 p-4 pt-0">
          {isOwn ? (
            <>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => editListing(listing)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="lg"
                className="flex-1"
                onClick={() => deleteListing(listing.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </>
          ) : (
            <>
              <Button
                size="lg"
                className="flex-1 hover-scale font-semibold"
                onClick={() => handleInterestInListing(listing)}
              >
                <Package className="w-5 h-5 mr-2" />
                Je veux acheter ce produit
              </Button>
              {isAdmin && (
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={() => deleteListing(listing.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              )}
            </>
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
              La marketplace est réservée aux membres VIP
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
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
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {currentImageIndex + 1} / {selectedImageGallery.length}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Want to Sell - Je vends
            </h1>
            <p className="text-muted-foreground mt-2">
              Publiez vos produits à vendre ou parcourez les annonces des autres membres.
            </p>
          </div>

          {/* Success Banner */}
          {showSuccessBanner && (
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4 flex items-center gap-3 animate-fade-in shadow-lg">
              <div className="bg-green-500 rounded-full p-2 shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-green-900 dark:text-green-100">
                  ✅ Votre intérêt a été envoyé avec succès !
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Un ticket a été créé. Le vendeur sera notifié et vous pourrez échanger via l'onglet "Mes demandes".
                </p>
              </div>
              <button
                onClick={() => setShowSuccessBanner(false)}
                className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Create Listing Button */}
          <Dialog open={showCreateDialog} onOpenChange={(open) => {
            setShowCreateDialog(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full md:w-auto hover-scale">
                <Package className="w-5 h-5 mr-2" />
                Publier une annonce
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingListing ? "Modifier l'annonce" : "Publier une annonce de vente"}</DialogTitle>
                <DialogDescription>
                  {editingListing ? "Modifiez votre annonce de vente" : "Décrivez le produit que vous souhaitez vendre. Les membres intéressés pourront vous contacter via le staff."}
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
                    <Label>Description / Précisions</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Précisez l&apos;état, les caractéristiques, etc..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>Photos du produit (optionnel)</Label>
                    <p className="text-xs text-muted-foreground mb-2">Ajoutez une ou plusieurs photos pour aider les acheteurs à identifier le produit</p>
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
                      <Label>Quantité disponible *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <Label>Prix par unité * (€)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="0.00"
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
                  Publier une annonce
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Tabs for all listings and my listings */}
          <Tabs defaultValue={new URLSearchParams(location.search).get('tab') || "all"} className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 p-1 bg-muted/50 rounded-lg">
              <TabsTrigger value="all" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                Toutes les annonces
              </TabsTrigger>
              <TabsTrigger value="mine" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                Mes annonces
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
              {listings.filter(l => l.user_id !== user?.id).length === 0 ? (
                <Card className="p-16 border-2 border-dashed border-muted-foreground/20 bg-muted/5">
                  <div className="text-center text-muted-foreground space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 rounded-full bg-muted/30">
                        <Package className="w-12 h-12 opacity-50" />
                      </div>
                    </div>
                    <p className="text-lg font-medium">Aucune annonce de vente pour le moment</p>
                    <p className="text-sm">Soyez le premier à publier une annonce !</p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.filter(l => l.user_id !== user?.id).map(listing => renderListing(listing, false))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="mine" className="mt-6 animate-fade-in">
              {myListings.filter(l => l.status === "active").length === 0 ? (
                <Card className="p-16 border-2 border-dashed border-muted-foreground/20 bg-muted/5">
                  <div className="text-center text-muted-foreground space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 rounded-full bg-muted/30">
                        <Package className="w-12 h-12 opacity-50" />
                      </div>
                    </div>
                    <p className="text-lg font-medium">Vous n&apos;avez pas encore publié d&apos;annonce</p>
                    <p className="text-sm">Cliquez sur &quot;Publier une annonce&quot; pour commencer</p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListings.filter(l => l.status === "active").map(listing => renderListing(listing, true))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="tickets" className="mt-6 animate-fade-in">
              <div className="space-y-6">
                {myTickets.length === 0 ? (
                  <Card className="p-16 border-2 border-dashed border-muted-foreground/20 bg-muted/5">
                    <div className="text-center text-muted-foreground space-y-4">
                      <div className="flex justify-center">
                        <div className="p-4 rounded-full bg-muted/30">
                          <MessageCircle className="w-12 h-12 opacity-50" />
                        </div>
                      </div>
                      <p className="text-lg font-medium">Aucune demande pour le moment</p>
                      <p className="text-sm">Lorsque des acheteurs seront intéressés par vos annonces, les tickets apparaîtront ici</p>
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
      </main>

      <Footer />
    </div>
  );
};

export default WantToSell;
