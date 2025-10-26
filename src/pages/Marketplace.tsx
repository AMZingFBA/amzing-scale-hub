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
import { Loader2, Package, Search, Upload, Trash2, ShoppingCart, ShoppingBag, MessageCircle, X, CheckCircle, Copy, ZoomIn, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface BuyRequest {
  id: string;
  user_id: string;
  asin: string | null;
  ean: string | null;
  title: string;
  description: string | null;
  quantity: number;
  max_price: number | null;
  price_type: string;
  status: string;
  created_at: string;
}

const Marketplace = () => {
  const { user, isVIP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine section based on route
  const getInitialSection = (): "buy" | "sell" | "my-buy-requests" | "my-sell-listings" => {
    if (location.pathname === "/acheter") return "buy";
    if (location.pathname === "/vendre") return "sell";
    return "buy";
  };
  
  const [activeSection, setActiveSection] = useState<"buy" | "sell" | "my-buy-requests" | "my-sell-listings">(getInitialSection());
  
  // Update section when route changes
  useEffect(() => {
    const newSection = getInitialSection();
    setActiveSection(newSection);
  }, [location.pathname, location.search]);
  
  // Sell listings
  const [listings, setListings] = useState<Listing[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  
  // Buy requests
  const [buyRequests, setBuyRequests] = useState<BuyRequest[]>([]);
  const [myBuyRequests, setMyBuyRequests] = useState<BuyRequest[]>([]);
  
  // Marketplace tickets
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Form states
  const [isCreating, setIsCreating] = useState(false);
  const [searchCode, setSearchCode] = useState("");
  const [searchType, setSearchType] = useState<"asin" | "ean">("asin");
  const [isSearching, setIsSearching] = useState(false);
  const [productFound, setProductFound] = useState(false);
  const [productData, setProductData] = useState<any>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
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
    loadBuyRequests();
    loadMyBuyRequests();
    loadMyTickets();

    const listingsChannel = supabase
      .channel("marketplace_listings_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "marketplace_listings" }, () => {
        loadListings();
        loadMyListings();
      })
      .subscribe();

    const buyRequestsChannel = supabase
      .channel("marketplace_buy_requests_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "marketplace_buy_requests" }, () => {
        loadBuyRequests();
        loadMyBuyRequests();
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
      supabase.removeChannel(buyRequestsChannel);
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
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyListings(data || []);
    } catch (error: any) {
      console.error("Error loading my listings:", error);
    }
  };

  const loadBuyRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("marketplace_buy_requests")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBuyRequests(data || []);
    } catch (error: any) {
      console.error("Error loading buy requests:", error);
      toast.error("Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  };

  const loadMyBuyRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("marketplace_buy_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyBuyRequests(data || []);
    } catch (error: any) {
      console.error("Error loading my buy requests:", error);
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
    try {
      // Simuler une recherche Amazon (à remplacer par une vraie API)
      // Pour l'instant, on simule avec un délai
      setTimeout(() => {
        // Simuler qu'on trouve un produit 50% du temps
        const found = Math.random() > 0.5;
        
        if (found) {
          setProductFound(true);
          setProductData({
            title: `Produit trouvé pour ${searchType.toUpperCase()}: ${searchCode}`,
            images: ["https://via.placeholder.com/400x400?text=Produit+Amazon"],
            description: "Description automatique du produit depuis Amazon"
          });
          setTitle(`Produit ${searchType.toUpperCase()}: ${searchCode}`);
          setDescription("Description automatique du produit depuis Amazon");
          setShowConfirmDialog(true);
        } else {
          setProductFound(false);
          toast.info("Produit non trouvé, vous pouvez uploader vos propres images");
          setTitle("");
          setDescription("");
        }
        setIsSearching(false);
      }, 1500);
    } catch (error: any) {
      toast.error("Erreur lors de la recherche");
      setIsSearching(false);
    }
  };

  const handleProductConfirmation = (confirmed: boolean) => {
    setShowConfirmDialog(false);
    if (confirmed && productData) {
      // Utiliser les données du produit trouvé
      setUploadedImages(productData.images);
      toast.success("Produit confirmé!");
    } else {
      // Réinitialiser pour permettre l'upload manuel
      setProductFound(false);
      setProductData(null);
      setTitle("");
      setDescription("");
      setUploadedImages([]);
      toast.info("Vous pouvez maintenant uploader vos propres fichiers");
    }
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

    if (activeSection === "sell" && !price) {
      toast.error("Le prix est requis");
      return;
    }

    setIsCreating(true);

    try {
      if (activeSection === "sell") {
        // Créer une annonce de vente
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
        navigate("/vendre");
      } else {
        // Créer une demande d'achat
        const { error } = await supabase
          .from("marketplace_buy_requests")
          .insert({
            user_id: user.id,
            asin: searchType === "asin" ? searchCode : null,
            ean: searchType === "ean" ? searchCode : null,
            title,
            description,
            quantity,
            max_price: price ? parseFloat(price) : null,
            price_type: priceType,
            status: "active"
          });

        if (error) throw error;
        toast.success("Demande d'achat créée avec succès!");
        
        await loadMyBuyRequests();
        navigate("/acheter");
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
    setUploadedFiles([]);
    setUploadedImages([]);
    setProductFound(false);
    setProductData(null);
  };

  const handleInterestInListing = async (listing: Listing) => {
    if (!user) return;

    // Empêcher d'acheter sa propre annonce
    if (listing.user_id === user.id) {
      toast.error("Vous ne pouvez pas acheter votre propre annonce!");
      return;
    }

    try {
      const code = listing.asin || listing.ean || "N/A";
      const subject = `Achat - ${listing.title} - ${code}`;
      
      // Créer un ticket pour l'acheteur + staff
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

      // Message initial pour l'acheteur
      const buyerMessage = `Je suis intéressé(e) par cette annonce:\n\nTitre: ${listing.title}\nCode: ${code}\nPrix: ${listing.price}€ ${listing.price_type}\nQuantité: ${listing.quantity}\n\nMerci de me contacter.`;
      
      await supabase.from("messages").insert({
        ticket_id: buyerTicket.id,
        user_id: user.id,
        content: buyerMessage
      });

      // Créer un ticket pour le vendeur + staff
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

      // Message initial pour le vendeur
      const sellerMessage = `Un acheteur est intéressé par votre annonce:\n\nTitre: ${listing.title}\nCode: ${code}\nPrix: ${listing.price}€ ${listing.price_type}\nQuantité: ${listing.quantity}\n\nLe staff va vous mettre en contact.`;
      
      await supabase.from("messages").insert({
        ticket_id: sellerTicket.id,
        user_id: user.id, // Message du système
        content: sellerMessage
      });

      toast.success("Demande d'achat envoyée! Le staff va vous contacter.");
      
      // Recharger les tickets et rediriger
      await loadMyTickets();
      navigate("/acheter");
    } catch (error: any) {
      console.error("Error creating tickets:", error);
      toast.error("Erreur lors de la création de la demande");
    }
  };

  const handleInterestInBuyRequest = async (buyRequest: BuyRequest) => {
    if (!user) return;

    // Empêcher de répondre à sa propre demande
    if (buyRequest.user_id === user.id) {
      toast.error("Vous ne pouvez pas répondre à votre propre demande!");
      return;
    }

    try {
      const code = buyRequest.asin || buyRequest.ean || "N/A";
      const subject = `Vente - ${buyRequest.title} - ${code}`;
      
      // Créer un ticket pour le vendeur + staff
      const { data: sellerTicket, error: sellerError } = await supabase
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

      if (sellerError) throw sellerError;

      // Message initial pour le vendeur
      const sellerMessage = `Je peux fournir ce produit demandé:\n\nTitre: ${buyRequest.title}\nCode: ${code}\nQuantité demandée: ${buyRequest.quantity}\nPrix max: ${buyRequest.max_price}€ ${buyRequest.price_type}\n\nMerci de me contacter.`;
      
      await supabase.from("messages").insert({
        ticket_id: sellerTicket.id,
        user_id: user.id,
        content: sellerMessage
      });

      // Créer un ticket pour l'acheteur + staff
      const buyerSubject = `Achat - ${buyRequest.title} - ${code}`;
      const { data: buyerTicket, error: buyerError } = await supabase
        .from("tickets")
        .insert({
          user_id: buyRequest.user_id,
          subject: buyerSubject,
          category: "marketplace",
          status: "open",
          priority: "normal"
        })
        .select()
        .single();

      if (buyerError) throw buyerError;

      // Message initial pour l'acheteur
      const buyerMessage = `Un vendeur peut fournir le produit que vous recherchez:\n\nTitre: ${buyRequest.title}\nCode: ${code}\nQuantité: ${buyRequest.quantity}\nPrix max: ${buyRequest.max_price}€ ${buyRequest.price_type}\n\nLe staff va vous mettre en contact.`;
      
      await supabase.from("messages").insert({
        ticket_id: buyerTicket.id,
        user_id: user.id, // Message du système
        content: buyerMessage
      });

      toast.success("Proposition de vente envoyée! Le staff va vous contacter.");
      
      // Recharger les tickets et rediriger
      await loadMyTickets();
      navigate("/vendre");
    } catch (error: any) {
      console.error("Error creating tickets:", error);
      toast.error("Erreur lors de la création de la proposition");
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

  const deleteBuyRequest = async (requestId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette demande?")) return;

    try {
      const { error } = await supabase
        .from("marketplace_buy_requests")
        .update({ status: "removed" })
        .eq("id", requestId);

      if (error) throw error;

      toast.success("Demande supprimée");
      await loadBuyRequests();
      await loadMyBuyRequests();
    } catch (error: any) {
      console.error("Error deleting buy request:", error);
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
    const hasImages = listing.images && listing.images.length > 0;
    
    return (
      <Card key={listing.id} className="hover:shadow-xl transition-all animate-fade-in overflow-hidden">
        {hasImages && (
          <div className="relative p-0">
            <div 
              className="relative cursor-pointer group/image"
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
            <Badge className="shrink-0 text-lg font-bold px-4 py-1.5 whitespace-nowrap">
              {listing.price}€ {listing.price_type}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 pt-0 pb-4">
          <div 
            className="flex items-center justify-between gap-2 group/code cursor-pointer bg-muted/40 hover:bg-muted/60 px-3 py-2.5 rounded-lg transition-colors border border-muted"
            onClick={() => copyToClipboard(code)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xs font-medium text-muted-foreground shrink-0">Code:</span>
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
            <Button
              variant="destructive"
              size="lg"
              className="w-full"
              onClick={() => deleteListing(listing.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer mon annonce
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                className="flex-1 hover-scale font-semibold"
                onClick={() => handleInterestInListing(listing)}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Je veux acheter
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

  const renderBuyRequest = (request: BuyRequest, isOwn: boolean) => {
    const code = request.asin || request.ean || "N/A";
    
    return (
      <Card key={request.id} className="hover:shadow-xl transition-all animate-fade-in overflow-hidden">
        <CardHeader className="space-y-4 pb-3">
          <div className="flex justify-between items-start gap-3">
            <CardTitle className="text-lg font-bold line-clamp-2">
              {request.title}
            </CardTitle>
            {request.max_price && (
              <Badge variant="secondary" className="shrink-0 text-lg font-bold px-4 py-1.5 whitespace-nowrap">
                Max {request.max_price}€ {request.price_type}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 pt-0 pb-4">
          <div 
            className="flex items-center justify-between gap-2 group/code cursor-pointer bg-muted/40 hover:bg-muted/60 px-3 py-2.5 rounded-lg transition-colors border border-muted"
            onClick={() => copyToClipboard(code)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xs font-medium text-muted-foreground shrink-0">Code:</span>
              <code className="font-mono font-bold text-sm truncate">{code}</code>
            </div>
            <Copy className="w-4 h-4 text-muted-foreground group-hover/code:text-primary transition-colors shrink-0" />
          </div>
          
          <div className="flex items-center justify-between bg-primary/5 border border-primary/20 px-3 py-2.5 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">Quantité recherchée</span>
            <span className="text-lg font-bold text-primary">{request.quantity} unité{request.quantity > 1 ? 's' : ''}</span>
          </div>
          
          {request.description && (
            <div className="bg-muted/30 px-3 py-2.5 rounded-lg">
              <p className="text-sm text-muted-foreground line-clamp-3">{request.description}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex gap-2 p-4 pt-0">
          {isOwn ? (
            <Button
              variant="destructive"
              size="lg"
              className="w-full"
              onClick={() => deleteBuyRequest(request.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer ma demande
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                className="flex-1 hover-scale font-semibold"
                onClick={() => handleInterestInBuyRequest(request)}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Je peux vendre
              </Button>
              {isAdmin && (
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={() => deleteBuyRequest(request.id)}
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
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
        {/* Buy Section - Recherche de produits */}
        {activeSection === "buy" && (
          <div className="w-full space-y-6 animate-fade-in">
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Rechercher des produits
              </h1>
              <p className="text-muted-foreground mt-2">
                Parcourez les annonces disponibles ou créez une demande d'achat
              </p>
            </div>

            {/* Create Buy Request Button */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full md:w-auto hover-scale">
                  <Package className="w-5 h-5 mr-2" />
                  Créer une demande d'achat
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer une demande d'achat</DialogTitle>
                  <DialogDescription>
                    Entrez un code ASIN ou EAN pour identifier le produit
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
                        placeholder="Nom du produit"
                      />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Précisez ce que vous recherchez..."
                        rows={4}
                      />
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
                        <Label>Prix max par unité (€)</Label>
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
                    Publier
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Tabs for listings */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-muted/50 rounded-lg">
                <TabsTrigger value="all" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                  Les annonces
                </TabsTrigger>
                <TabsTrigger value="mine" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                  Mes annonces
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6 animate-fade-in">
                {listings.filter(l => l.user_id !== user?.id).length === 0 ? (
                  <Card className="p-16 border-2 border-dashed border-muted-foreground/20 bg-muted/5">
                    <div className="text-center text-muted-foreground space-y-4">
                      <div className="flex justify-center">
                        <div className="p-4 rounded-full bg-muted/30">
                          <ShoppingBag className="w-12 h-12 opacity-50" />
                        </div>
                      </div>
                      <p className="text-lg font-medium">Aucune annonce disponible pour le moment</p>
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
                          <ShoppingBag className="w-12 h-12 opacity-50" />
                        </div>
                      </div>
                      <p className="text-lg font-medium">Vous n'avez pas encore créé d'annonce</p>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myListings.filter(l => l.status === "active").map(listing => renderListing(listing, true))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Sell Section - Mes annonces */}
        {activeSection === "sell" && (
          <div className="w-full space-y-6 animate-fade-in">
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Vendre des produits
              </h1>
              <p className="text-muted-foreground mt-2">
                Créez une annonce de vente ou consultez vos annonces
              </p>
            </div>

            {/* Create Listing Button */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full md:w-auto hover-scale">
                  <Package className="w-5 h-5 mr-2" />
                  Créer une annonce de vente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer une annonce de vente</DialogTitle>
                  <DialogDescription>
                    Entrez un code ASIN ou EAN pour identifier le produit
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

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {uploadedImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                          <button
                            onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label>Images / Fichiers</Label>
                      <div className="mt-2">
                        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="text-center">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Cliquez pour uploader (PNG, JPG, PDF)
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {uploadedFiles.length} fichier(s) sélectionné(s)
                            </p>
                          </div>
                          <input
                            type="file"
                            multiple
                            accept="image/*,.pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <Label>Titre du produit *</Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Nom du produit"
                      />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Décrivez votre produit..."
                        rows={4}
                      />
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
                    Publier
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* My Listings */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Mes annonces</h2>
              {myListings.length === 0 ? (
                <Card className="p-16 border-2 border-dashed border-muted-foreground/20 bg-muted/5">
                  <div className="text-center text-muted-foreground space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 rounded-full bg-muted/30">
                        <ShoppingBag className="w-12 h-12 opacity-50" />
                      </div>
                    </div>
                    <p className="text-lg font-medium">Vous n'avez pas encore créé d'annonce de vente</p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListings.map(listing => renderListing(listing, true))}
                </div>
              )}
            </div>

            {/* Buy Requests */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Demandes d'achat des membres</h2>
              {buyRequests.length === 0 ? (
                <Card className="p-16 border-2 border-dashed border-muted-foreground/20 bg-muted/5">
                  <div className="text-center text-muted-foreground space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 rounded-full bg-muted/30">
                        <ShoppingCart className="w-12 h-12 opacity-50" />
                      </div>
                    </div>
                    <p className="text-lg font-medium">Aucune demande d'achat pour le moment</p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {buyRequests.map(request => renderBuyRequest(request, false))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Produit trouvé sur Amazon!</DialogTitle>
            <DialogDescription>
              Est-ce le bon produit?
            </DialogDescription>
          </DialogHeader>
          
          {productData && (
            <div className="space-y-4">
              <img src={productData.images[0]} alt="Product" className="w-full h-64 object-contain rounded-lg" />
              <div>
                <h3 className="font-semibold">{productData.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{productData.description}</p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => handleProductConfirmation(false)}>
              <X className="w-4 h-4 mr-2" />
              Non, uploader mes photos
            </Button>
            <Button onClick={() => handleProductConfirmation(true)}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Oui, c'est ce produit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;
