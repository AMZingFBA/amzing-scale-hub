import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
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
import { Loader2, Upload, Trash2, ShoppingBag, MessageCircle, X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
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
    loadListings();
    loadMyListings();

    const listingsChannel = supabase
      .channel("marketplace_listings_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "marketplace_listings" }, () => {
        loadListings();
        loadMyListings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(listingsChannel);
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
        .neq("user_id", user?.id || "")
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
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyListings(data || []);
    } catch (error: any) {
      console.error("Error loading my listings:", error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setUploadedFiles([...uploadedFiles, ...newFiles]);

    const urls = await uploadFilesToStorage(newFiles);
    setUploadedImages([...uploadedImages, ...urls]);
  };

  const uploadFilesToStorage = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}/${Date.now()}_${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
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

  const removeImage = (index: number) => {
    const newFiles = [...uploadedFiles];
    const newImages = [...uploadedImages];
    newFiles.splice(index, 1);
    newImages.splice(index, 1);
    setUploadedFiles(newFiles);
    setUploadedImages(newImages);
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

    if (uploadedImages.length === 0) {
      toast.error("Au moins une photo est requise");
      return;
    }

    setIsCreating(true);

    try {
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
      toast.success("Annonce créée avec succès!");
      
      resetForm();
      setShowCreateDialog(false);
      await loadMyListings();
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
    setUploadedFiles([]);
    setUploadedImages([]);
  };

  const handleInterestInListing = async (listing: Listing) => {
    if (!user) return;

    if (listing.user_id === user.id) {
      toast.error("Vous ne pouvez pas acheter votre propre annonce!");
      return;
    }

    try {
      const code = listing.asin || listing.ean || "N/A";
      const subject = `Achat - ${listing.title} - ${code}`;
      
      const { data: buyerTicket, error: buyerError } = await supabase
        .from("tickets")
        .insert({
          user_id: user.id,
          subject: subject,
          category: "marketplace",
          status: "open",
          priority: "normal"
        })
        .select()
        .single();

      if (buyerError) throw buyerError;

      const buyerMessage = `Je suis intéressé(e) par cette annonce:\n\nTitre: ${listing.title}\nCode: ${code}\nPrix: ${listing.price}€ ${listing.price_type}\nQuantité: ${listing.quantity}\n\nMerci de me contacter.`;
      
      await supabase.from("messages").insert({
        ticket_id: buyerTicket.id,
        user_id: user.id,
        content: buyerMessage
      });

      const sellerSubject = `Vente - ${listing.title} - ${code}`;
      const { data: sellerTicket, error: sellerError } = await supabase
        .from("tickets")
        .insert({
          user_id: listing.user_id,
          subject: sellerSubject,
          category: "marketplace",
          status: "open",
          priority: "normal"
        })
        .select()
        .single();

      if (sellerError) throw sellerError;

      const sellerMessage = `Un acheteur est intéressé par votre annonce:\n\nTitre: ${listing.title}\nCode: ${code}\nPrix: ${listing.price}€ ${listing.price_type}\nQuantité: ${listing.quantity}\n\nLe staff va vous mettre en contact.`;
      
      await supabase.from("messages").insert({
        ticket_id: sellerTicket.id,
        user_id: user.id,
        content: sellerMessage
      });

      toast.success("Demande d'achat envoyée! Le staff va vous contacter.");
      navigate("/support");
    } catch (error: any) {
      console.error("Error creating tickets:", error);
      toast.error("Erreur lors de la création de la demande");
    }
  };

  const deleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from("marketplace_listings")
        .update({ status: "deleted" })
        .eq("id", id);

      if (error) throw error;
      toast.success("Annonce supprimée");
      await loadMyListings();
    } catch (error: any) {
      console.error("Error deleting listing:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const openImageGallery = (images: string[], startIndex: number = 0) => {
    setSelectedImageGallery(images);
    setCurrentImageIndex(startIndex);
    setShowImageDialog(true);
  };

  const nextImage = () => {
    if (selectedImageGallery) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedImageGallery.length);
    }
  };

  const previousImage = () => {
    if (selectedImageGallery) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedImageGallery.length) % selectedImageGallery.length);
    }
  };

  const renderListing = (listing: Listing, showActions: boolean = true) => (
    <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{listing.title}</CardTitle>
            <CardDescription className="text-sm">
              {listing.asin && `ASIN: ${listing.asin}`}
              {listing.ean && `EAN: ${listing.ean}`}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2">
            {listing.price}€ {listing.price_type}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {listing.images && listing.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {listing.images.slice(0, 4).map((img, idx) => (
              <div key={idx} className="relative aspect-square cursor-pointer group" onClick={() => openImageGallery(listing.images, idx)}>
                <img src={img} alt={`${listing.title} ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
                {idx === 3 && listing.images.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">+{listing.images.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {listing.description && (
          <p className="text-sm text-muted-foreground">{listing.description}</p>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Quantité: {listing.quantity}</span>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="flex gap-2">
          {listing.user_id === user?.id || isAdmin ? (
            <Button variant="destructive" size="sm" onClick={() => deleteListing(listing.id)} className="flex-1">
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={() => handleInterestInListing(listing)} className="flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              Je veux acheter
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <ShoppingBag className="inline-block w-10 h-10 mr-2 mb-1" />
              Want to Sell - Je vends
            </h1>
            <p className="text-muted-foreground text-lg">
              Publiez vos produits à vendre ou parcourez les annonces des autres membres
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="all">Toutes les annonces</TabsTrigger>
                <TabsTrigger value="my">Mes annonces</TabsTrigger>
              </TabsList>
              
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button variant="default" size="lg">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Publier une annonce
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Publier un produit à vendre</DialogTitle>
                    <DialogDescription>
                      Ajoutez les détails de votre produit avec des photos
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type de code</Label>
                        <Select value={searchType} onValueChange={(v: "asin" | "ean") => setSearchType(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asin">ASIN</SelectItem>
                            <SelectItem value="ean">EAN</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Code {searchType.toUpperCase()} (optionnel)</Label>
                        <Input
                          placeholder={`Ex: ${searchType === "asin" ? "B08XYZ1234" : "1234567890123"}`}
                          value={searchCode}
                          onChange={(e) => setSearchCode(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Titre du produit *</Label>
                      <Input
                        placeholder="Ex: iPhone 15 Pro Max 256GB"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Décrivez votre produit..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Quantité *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Prix unitaire * (€)</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="flex-1"
                          />
                          <Select value={priceType} onValueChange={(v: "TTC" | "HT") => setPriceType(v)}>
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

                    <div className="space-y-2">
                      <Label>Photos du produit * (minimum 1)</Label>
                      <div className="border-2 border-dashed rounded-lg p-4">
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          className="mb-2"
                        />
                        {uploadedImages.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            {uploadedImages.map((img, idx) => (
                              <div key={idx} className="relative aspect-square">
                                <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover rounded" />
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="absolute top-1 right-1 h-6 w-6 p-0"
                                  onClick={() => removeImage(idx)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Annuler
                    </Button>
                    <Button onClick={createListing} disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Création...
                        </>
                      ) : (
                        "Publier l'annonce"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <TabsContent value="all" className="space-y-4">
              {listings.length === 0 ? (
                <Card className="p-12 text-center">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Aucune annonce disponible</h3>
                  <p className="text-muted-foreground">
                    Soyez le premier à publier une annonce de vente
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {listings.map(listing => renderListing(listing, true))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="my" className="space-y-4">
              {myListings.length === 0 ? (
                <Card className="p-12 text-center">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Aucune annonce</h3>
                  <p className="text-muted-foreground mb-4">
                    Vous n'avez pas encore publié d'annonce de vente
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    Publier ma première annonce
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myListings.map(listing => renderListing(listing, true))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-4xl">
          {selectedImageGallery && (
            <div className="relative">
              <img 
                src={selectedImageGallery[currentImageIndex]} 
                alt={`Image ${currentImageIndex + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              {selectedImageGallery.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={previousImage}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {selectedImageGallery.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default WantToSell;
