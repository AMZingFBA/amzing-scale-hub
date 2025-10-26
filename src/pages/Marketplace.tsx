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
import { Loader2, Package, Search, Upload, Trash2, ShoppingCart, ShoppingBag, Copy, Check, MessageCircle } from "lucide-react";
import ChatRoom from "@/components/chat/ChatRoom";
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
  const getInitialSection = (): "buy" | "sell" => {
    if (location.pathname === "/acheter") return "buy";
    if (location.pathname === "/vendre") return "sell";
    return "buy";
  };
  
  const [activeSection, setActiveSection] = useState<"buy" | "sell">(getInitialSection());
  
  // Update section when route changes
  useEffect(() => {
    const newSection = getInitialSection();
    setActiveSection(newSection);
    
    // Check for tab parameter in URL
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam === 'my-requests') {
      setActiveTab('my-requests');
    } else if (tabParam === 'my-sales') {
      setActiveTab('my-sales');
    } else {
      // Reset tab when changing section without tab parameter
      setActiveTab("all");
    }
  }, [location.pathname, location.search]);
  
  // Sell listings
  const [listings, setListings] = useState<Listing[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  
  // Buy requests
  const [buyRequests, setBuyRequests] = useState<BuyRequest[]>([]);
  const [myBuyRequests, setMyBuyRequests] = useState<BuyRequest[]>([]);
  
  const [activeTab, setActiveTab] = useState<string>("all");
  
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
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState<"TTC" | "HT">("TTC");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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

    return () => {
      supabase.removeChannel(listingsChannel);
      supabase.removeChannel(buyRequestsChannel);
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
      // Pour l'instant, on demande simplement à l'utilisateur de confirmer
      setTimeout(() => {
        setIsSearching(false);
        setProductFound(false);
        setProductData(null);
        toast.info("Produit non trouvé automatiquement. Veuillez uploader les images manuellement.");
      }, 1000);
    } catch (error) {
      setIsSearching(false);
      toast.error("Erreur lors de la recherche du produit");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";
      return isImage || isPdf;
    });

    if (validFiles.length !== files.length) {
      toast.error("Seuls les images (PNG, JPG, WEBP) et PDF sont acceptés");
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const uploadFilesToStorage = async (): Promise<string[]> => {
    if (!user || uploadedFiles.length === 0) return [];

    const urls: string[] = [];

    for (const file of uploadedFiles) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("marketplace-images")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("marketplace-images")
        .getPublicUrl(fileName);

      urls.push(publicUrl);
    }

    return urls;
  };

  const createListing = async () => {
    if (!user) return;

    if (!title.trim()) {
      toast.error("Veuillez entrer un titre");
      return;
    }

    if (activeSection === "sell") {
      if (!price || parseFloat(price) <= 0) {
        toast.error("Veuillez entrer un prix valide");
        return;
      }
    }

    if (quantity < 1) {
      toast.error("La quantité doit être au moins 1");
      return;
    }

    setIsCreating(true);

    try {
      if (activeSection === "sell") {
        const imageUrls = await uploadFilesToStorage();

        const { error } = await supabase.from("marketplace_listings").insert({
          user_id: user.id,
          asin: searchType === "asin" ? searchCode : null,
          ean: searchType === "ean" ? searchCode : null,
          title,
          description,
          images: imageUrls,
          quantity,
          price: parseFloat(price),
          price_type: priceType,
          status: "active"
        });

        if (error) throw error;
        toast.success("Annonce de vente créée avec succès!");
        loadMyListings();
      } else {
        const { error } = await supabase.from("marketplace_buy_requests").insert({
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
        loadMyBuyRequests();
      }

      setShowCreateDialog(false);
      resetForm();
    } catch (error: any) {
      console.error("Error creating:", error);
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

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    toast.success(`${type} copié!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleInterestInListing = async (listing: Listing) => {
    if (!user) return;

    // Prevent buying your own listing
    if (listing.user_id === user.id) {
      toast.error("Vous ne pouvez pas acheter votre propre annonce!");
      return;
    }

    try {
      const code = listing.asin || listing.ean || "N/A";
      const subject = `Achat - ${listing.title} - ${code}`;
      
      // Create a ticket for the purchase request
      const { data: ticket, error: ticketError } = await supabase
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

      if (ticketError) throw ticketError;

      // Add initial message with listing details
      const initialMessage = `Je suis intéressé(e) par cette annonce:\n\nTitre: ${listing.title}\nCode: ${code}\nPrix: ${listing.price}€ ${listing.price_type}\nQuantité: ${listing.quantity}\n\nMerci de me contacter.`;
      
      await supabase.from("messages").insert({
        ticket_id: ticket.id,
        user_id: user.id,
        content: initialMessage
      });

      toast.success("Demande d'achat envoyée au staff!");
      
      // Reload tickets and switch to my-requests tab
      await loadMyTickets();
      setActiveTab("my-requests");
      setShowCreateDialog(false);
    } catch (error: any) {
      console.error("Error creating ticket:", error);
      toast.error("Erreur lors de la création de la demande");
    }
  };

  const handleInterestInBuyRequest = async (buyRequest: BuyRequest) => {
    if (!user) return;

    // Prevent selling to yourself
    if (buyRequest.user_id === user.id) {
      toast.error("Vous ne pouvez pas répondre à votre propre demande!");
      return;
    }

    try {
      const code = buyRequest.asin || buyRequest.ean || "N/A";
      const subject = `Vente - ${buyRequest.title} - ${code}`;
      
      // Create a ticket for the sale response
      const { data: ticket, error: ticketError } = await supabase
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

      if (ticketError) throw ticketError;

      // Add initial message with buy request details
      const initialMessage = `Je peux fournir ce produit demandé:\n\nTitre: ${buyRequest.title}\nCode: ${code}\nQuantité demandée: ${buyRequest.quantity}\nPrix max: ${buyRequest.max_price}€ ${buyRequest.price_type}\n\nMerci de me contacter.`;
      
      await supabase.from("messages").insert({
        ticket_id: ticket.id,
        user_id: user.id,
        content: initialMessage
      });

      toast.success("Proposition de vente envoyée au staff!");
      
      // Reload tickets and switch to my-sales tab in sell section
      await loadMyTickets();
      setActiveSection("sell");
      setActiveTab("my-sales");
      setShowCreateDialog(false);
    } catch (error: any) {
      console.error("Error creating ticket:", error);
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
      loadListings();
      loadMyListings();
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
      loadBuyRequests();
      loadMyBuyRequests();
    } catch (error: any) {
      console.error("Error deleting buy request:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const renderListing = (listing: Listing, showActions: boolean = false) => (
    <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{listing.title}</CardTitle>
            <CardDescription className="mt-1">
              Vendeur vérifié
            </CardDescription>
          </div>
          <Badge variant={listing.status === "active" ? "default" : "secondary"}>
            {listing.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {listing.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {listing.images.slice(0, 4).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${listing.title} ${idx + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
            ))}
          </div>
        )}
        {listing.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {listing.description}
          </p>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Quantité: {listing.quantity}</span>
          <span className="text-xl font-bold text-primary">
            {listing.price}€ <span className="text-sm">{listing.price_type}/unité</span>
          </span>
        </div>
        {(listing.asin || listing.ean) && (
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground flex-1">
              {listing.asin ? `ASIN: ${listing.asin}` : `EAN: ${listing.ean}`}
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2"
              onClick={() => copyToClipboard(listing.asin || listing.ean || "", listing.asin ? "ASIN" : "EAN")}
            >
              {copiedCode === (listing.asin ? "ASIN" : "EAN") ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {showActions ? (
          <>
            {(user?.id === listing.user_id || isAdmin) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteListing(listing.id)}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            )}
          </>
        ) : (
          user?.id !== listing.user_id && (
            <Button
              onClick={() => handleInterestInListing(listing)}
              className="flex-1"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Je veux acheter
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );

  const renderBuyRequest = (buyRequest: BuyRequest, showActions: boolean = false) => (
    <Card key={buyRequest.id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{buyRequest.title}</CardTitle>
            <CardDescription className="mt-1">
              Demande d'achat vérifiée
            </CardDescription>
          </div>
          <Badge variant={buyRequest.status === "active" ? "default" : "secondary"}>
            {buyRequest.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {buyRequest.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {buyRequest.description}
          </p>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Quantité recherchée: {buyRequest.quantity}</span>
          {buyRequest.max_price && (
            <span className="text-xl font-bold text-primary">
              Max: {buyRequest.max_price}€ <span className="text-sm">{buyRequest.price_type}/unité</span>
            </span>
          )}
        </div>
        {(buyRequest.asin || buyRequest.ean) && (
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground flex-1">
              {buyRequest.asin ? `ASIN: ${buyRequest.asin}` : `EAN: ${buyRequest.ean}`}
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2"
              onClick={() => copyToClipboard(buyRequest.asin || buyRequest.ean || "", buyRequest.asin ? "ASIN" : "EAN")}
            >
              {copiedCode === (buyRequest.asin ? "ASIN" : "EAN") ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {showActions ? (
          <>
            {(user?.id === buyRequest.user_id || isAdmin) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteBuyRequest(buyRequest.id)}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            )}
          </>
        ) : (
          user?.id !== buyRequest.user_id && (
            <Button
              onClick={() => handleInterestInBuyRequest(buyRequest)}
              className="flex-1"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Je peux vendre
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );

  if (!isVIP && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {activeSection === "buy" ? "Acheter" : "Vendre"}
          </h1>
          <p className="text-muted-foreground">
            {activeSection === "buy" 
              ? "Trouvez les produits que vous recherchez" 
              : "Mettez en vente vos produits"}
          </p>
        </div>

        {/* Action Button */}
        <div className="mb-6">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full md:w-auto">
                <Package className="w-5 h-5 mr-2" />
                {activeSection === "sell" ? "Créer une annonce de vente" : "Créer une demande d'achat"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {activeSection === "sell" ? "Créer une annonce de vente" : "Créer une demande d'achat"}
                </DialogTitle>
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
                      placeholder={activeSection === "sell" ? "Décrivez votre produit..." : "Précisez ce que vous recherchez..."}
                      rows={4}
                    />
                  </div>

                  {activeSection === "sell" && (
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
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Quantité *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQuantity(val === '' ? 1 : parseInt(val) || 1);
                        }}
                      />
                    </div>
                    <div>
                      <Label>
                        {activeSection === "sell" ? "Prix par unité * (€)" : "Prix max par unité (€)"}
                      </Label>
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
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    resetForm();
                  }}
                >
                  Annuler
                </Button>
                <Button onClick={createListing} disabled={isCreating}>
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Package className="w-4 h-4 mr-2" />
                  )}
                  Publier
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Buy Section */}
        {activeSection === "buy" && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="all">Toutes les demandes</TabsTrigger>
              <TabsTrigger value="mine">Mes demandes</TabsTrigger>
              <TabsTrigger value="my-requests">Mes demandes d'achat</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {buyRequests.length === 0 ? (
                <Card className="p-12">
                  <div className="text-center text-muted-foreground">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune demande d'achat pour le moment</p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {buyRequests.map(request => renderBuyRequest(request, false))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="mine" className="mt-6">
              {myBuyRequests.length === 0 ? (
                <Card className="p-12">
                  <div className="text-center text-muted-foreground">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Vous n'avez pas encore créé de demande d'achat</p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myBuyRequests.map(request => renderBuyRequest(request, true))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-requests" className="mt-6">
              <Tabs defaultValue="ongoing" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="ongoing">En cours</TabsTrigger>
                  <TabsTrigger value="completed">Terminé</TabsTrigger>
                </TabsList>

                <TabsContent value="ongoing" className="mt-6">
                  {selectedTicket ? (
                    <div className="space-y-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedTicket(null)}
                      >
                        ← Retour aux demandes
                      </Button>
                      <iframe 
                        src={`/ticket/${selectedTicket}`}
                        className="w-full h-[600px] rounded-lg border"
                        title="Ticket"
                      />
                    </div>
                  ) : (
                    <>
                      {myTickets.filter(t => t.subject.startsWith('Achat') && ['open', 'in_progress'].includes(t.status)).length === 0 ? (
                        <Card className="p-12">
                          <div className="text-center text-muted-foreground">
                            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Aucune demande d'achat en cours</p>
                            <p className="text-sm mt-2">Cliquez sur "Je veux acheter" sur une annonce pour créer une demande</p>
                          </div>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {myTickets
                            .filter(t => t.subject.startsWith('Achat') && ['open', 'in_progress'].includes(t.status))
                            .map((ticket) => (
                            <Card key={ticket.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                                    <CardDescription className="mt-1">
                                      Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                                    </CardDescription>
                                  </div>
                                  <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'}>
                                    {ticket.status === 'open' ? 'Ouvert' : 'En cours'}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardFooter>
                                <Button 
                                  className="w-full"
                                  onClick={() => setSelectedTicket(ticket.id)}
                                >
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Voir la conversation
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                  {myTickets.filter(t => t.subject.startsWith('Achat') && t.status === 'closed').length === 0 ? (
                    <Card className="p-12">
                      <div className="text-center text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune demande d'achat terminée</p>
                      </div>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {myTickets
                        .filter(t => t.subject.startsWith('Achat') && t.status === 'closed')
                        .map((ticket) => (
                        <Card key={ticket.id} className="hover:shadow-lg transition-shadow cursor-pointer opacity-70">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                                <CardDescription className="mt-1">
                                  Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                                  {ticket.closed_at && ` • Fermé le ${new Date(ticket.closed_at).toLocaleDateString('fr-FR')}`}
                                </CardDescription>
                              </div>
                              <Badge variant="outline">Fermé</Badge>
                            </div>
                          </CardHeader>
                          <CardFooter>
                            <Button 
                              className="w-full"
                              variant="outline"
                              onClick={() => setSelectedTicket(ticket.id)}
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Voir l'historique
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        )}

        {/* Sell Section */}
        {activeSection === "sell" && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="all">Toutes les annonces</TabsTrigger>
              <TabsTrigger value="mine">Mes annonces</TabsTrigger>
              <TabsTrigger value="my-sales">Mes demandes de vente</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {listings.length === 0 ? (
                <Card className="p-12">
                  <div className="text-center text-muted-foreground">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune annonce de vente disponible pour le moment</p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map(listing => renderListing(listing, false))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="mine" className="mt-6">
              {myListings.length === 0 ? (
                <Card className="p-12">
                  <div className="text-center text-muted-foreground">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Vous n'avez pas encore créé d'annonce de vente</p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListings.map(listing => renderListing(listing, true))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-sales" className="mt-6">
              <Tabs defaultValue="ongoing" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="ongoing">En cours</TabsTrigger>
                  <TabsTrigger value="completed">Terminé</TabsTrigger>
                </TabsList>

                <TabsContent value="ongoing" className="mt-6">
                  {selectedTicket ? (
                    <div className="space-y-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedTicket(null)}
                      >
                        ← Retour aux demandes
                      </Button>
                      <iframe 
                        src={`/ticket/${selectedTicket}`}
                        className="w-full h-[600px] rounded-lg border"
                        title="Ticket"
                      />
                    </div>
                  ) : (
                    <>
                      {myTickets.filter(t => t.subject.startsWith('Vente') && ['open', 'in_progress'].includes(t.status)).length === 0 ? (
                        <Card className="p-12">
                          <div className="text-center text-muted-foreground">
                            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Aucune demande de vente en cours</p>
                            <p className="text-sm mt-2">Cliquez sur "Je peux vendre" sur une demande pour créer une proposition</p>
                          </div>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {myTickets
                            .filter(t => t.subject.startsWith('Vente') && ['open', 'in_progress'].includes(t.status))
                            .map((ticket) => (
                            <Card key={ticket.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                                    <CardDescription className="mt-1">
                                      Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                                    </CardDescription>
                                  </div>
                                  <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'}>
                                    {ticket.status === 'open' ? 'Ouvert' : 'En cours'}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardFooter>
                                <Button 
                                  className="w-full"
                                  onClick={() => setSelectedTicket(ticket.id)}
                                >
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Voir la conversation
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                  {myTickets.filter(t => t.subject.startsWith('Vente') && t.status === 'closed').length === 0 ? (
                    <Card className="p-12">
                      <div className="text-center text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune demande de vente terminée</p>
                      </div>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {myTickets
                        .filter(t => t.subject.startsWith('Vente') && t.status === 'closed')
                        .map((ticket) => (
                        <Card key={ticket.id} className="hover:shadow-lg transition-shadow cursor-pointer opacity-70">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                                <CardDescription className="mt-1">
                                  Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                                  {ticket.closed_at && ` • Fermé le ${new Date(ticket.closed_at).toLocaleDateString('fr-FR')}`}
                                </CardDescription>
                              </div>
                              <Badge variant="outline">Fermé</Badge>
                            </div>
                          </CardHeader>
                          <CardFooter>
                            <Button 
                              className="w-full"
                              variant="outline"
                              onClick={() => setSelectedTicket(ticket.id)}
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Voir l'historique
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Marketplace;