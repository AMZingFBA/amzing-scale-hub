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
      
      // Reload tickets
      await loadMyTickets();
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
      
      // Reload tickets and switch to sell section
      await loadMyTickets();
      setActiveSection("sell");
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
        {/* Buy Section */}
        {activeSection === "buy" && (
          <div className="w-full space-y-6 animate-fade-in">
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Mes demandes d'achat :
              </h1>
            </div>
            
            <Tabs defaultValue="ongoing" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 p-1 bg-muted/50 rounded-lg">
                <TabsTrigger 
                  value="ongoing"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                >
                  En cours
                </TabsTrigger>
                <TabsTrigger 
                  value="completed"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                >
                  Terminé
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ongoing" className="mt-6 animate-fade-in">
                {selectedTicket ? (
                  <div className="space-y-4 animate-scale-in">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedTicket(null)}
                      className="hover-scale"
                    >
                      ← Retour aux demandes
                    </Button>
                    <iframe 
                      src={`/ticket/${selectedTicket}`}
                      className="w-full h-[600px] rounded-lg border shadow-lg"
                      title="Ticket"
                    />
                  </div>
                ) : (
                  <>
                    {myTickets.filter(t => t.subject.startsWith('Achat') && ['open', 'in_progress'].includes(t.status)).length === 0 ? (
                      <Card className="p-16 border-2 border-dashed border-muted-foreground/20 bg-muted/5 animate-fade-in">
                        <div className="text-center text-muted-foreground space-y-4">
                          <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-muted/30">
                              <MessageCircle className="w-12 h-12 opacity-50" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg font-medium">Aucune demande d'achat en cours</p>
                            <p className="text-sm">
                              Cliquez sur <span className="font-semibold text-primary">"Je veux acheter"</span> sur une annonce pour créer une demande
                            </p>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 animate-fade-in">
                        {myTickets
                          .filter(t => t.subject.startsWith('Achat') && ['open', 'in_progress'].includes(t.status))
                          .map((ticket) => (
                          <Card key={ticket.id} className="hover:shadow-lg transition-all hover-scale cursor-pointer group">
                            <CardHeader>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                    {ticket.subject}
                                  </CardTitle>
                                  <CardDescription className="mt-2 flex items-center gap-2">
                                    <span className="text-xs">
                                      Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                                    </span>
                                  </CardDescription>
                                </div>
                                <Badge 
                                  variant={ticket.status === 'open' ? 'default' : 'secondary'}
                                  className="shrink-0"
                                >
                                  {ticket.status === 'open' ? 'Ouvert' : 'En cours'}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardFooter>
                              <Button 
                                className="w-full hover-scale"
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

              <TabsContent value="completed" className="mt-6 animate-fade-in">
                {myTickets.filter(t => t.subject.startsWith('Achat') && t.status === 'closed').length === 0 ? (
                  <Card className="p-16 border-2 border-dashed border-muted-foreground/20 bg-muted/5 animate-fade-in">
                    <div className="text-center text-muted-foreground space-y-4">
                      <div className="flex justify-center">
                        <div className="p-4 rounded-full bg-muted/30">
                          <MessageCircle className="w-12 h-12 opacity-50" />
                        </div>
                      </div>
                      <p className="text-lg font-medium">Aucune demande d'achat terminée</p>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4 animate-fade-in">
                    {myTickets
                      .filter(t => t.subject.startsWith('Achat') && t.status === 'closed')
                      .map((ticket) => (
                      <Card key={ticket.id} className="hover:shadow-lg transition-all cursor-pointer opacity-70 hover:opacity-100 group">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {ticket.subject}
                              </CardTitle>
                              <CardDescription className="mt-2 text-xs space-y-1">
                                <div>Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR')}</div>
                                {ticket.closed_at && (
                                  <div>Fermé le {new Date(ticket.closed_at).toLocaleDateString('fr-FR')}</div>
                                )}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="shrink-0">
                              Fermé
                            </Badge>
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
          </div>
        )}

        {/* Sell Section */}
        {activeSection === "sell" && (
          <div className="w-full space-y-6 animate-fade-in">
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Mes demandes de vente :
              </h1>
            </div>
            
            <Tabs defaultValue="ongoing" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 p-1 bg-muted/50 rounded-lg">
                <TabsTrigger 
                  value="ongoing"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                >
                  En cours
                </TabsTrigger>
                <TabsTrigger 
                  value="completed"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                >
                  Terminé
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ongoing" className="mt-6 animate-fade-in">
                {selectedTicket ? (
                  <div className="space-y-4 animate-scale-in">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedTicket(null)}
                      className="hover-scale"
                    >
                      ← Retour aux demandes
                    </Button>
                    <iframe 
                      src={`/ticket/${selectedTicket}`}
                      className="w-full h-[600px] rounded-lg border shadow-lg"
                      title="Ticket"
                    />
                  </div>
                ) : (
                  <>
                    {myTickets.filter(t => t.subject.startsWith('Vente') && ['open', 'in_progress'].includes(t.status)).length === 0 ? (
                      <Card className="p-16 border-2 border-dashed border-muted-foreground/20 bg-muted/5 animate-fade-in">
                        <div className="text-center text-muted-foreground space-y-4">
                          <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-muted/30">
                              <MessageCircle className="w-12 h-12 opacity-50" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg font-medium">Aucune demande de vente en cours</p>
                            <p className="text-sm">
                              Cliquez sur <span className="font-semibold text-primary">"Je peux vendre"</span> sur une demande pour créer une proposition
                            </p>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 animate-fade-in">
                        {myTickets
                          .filter(t => t.subject.startsWith('Vente') && ['open', 'in_progress'].includes(t.status))
                          .map((ticket) => (
                          <Card key={ticket.id} className="hover:shadow-lg transition-all hover-scale cursor-pointer group">
                            <CardHeader>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                    {ticket.subject}
                                  </CardTitle>
                                  <CardDescription className="mt-2 flex items-center gap-2">
                                    <span className="text-xs">
                                      Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                                    </span>
                                  </CardDescription>
                                </div>
                                <Badge 
                                  variant={ticket.status === 'open' ? 'default' : 'secondary'}
                                  className="shrink-0"
                                >
                                  {ticket.status === 'open' ? 'Ouvert' : 'En cours'}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardFooter>
                              <Button 
                                className="w-full hover-scale"
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

              <TabsContent value="completed" className="mt-6 animate-fade-in">
                {myTickets.filter(t => t.subject.startsWith('Vente') && t.status === 'closed').length === 0 ? (
                  <Card className="p-16 border-2 border-dashed border-muted-foreground/20 bg-muted/5 animate-fade-in">
                    <div className="text-center text-muted-foreground space-y-4">
                      <div className="flex justify-center">
                        <div className="p-4 rounded-full bg-muted/30">
                          <MessageCircle className="w-12 h-12 opacity-50" />
                        </div>
                      </div>
                      <p className="text-lg font-medium">Aucune demande de vente terminée</p>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4 animate-fade-in">
                    {myTickets
                      .filter(t => t.subject.startsWith('Vente') && t.status === 'closed')
                      .map((ticket) => (
                      <Card key={ticket.id} className="hover:shadow-lg transition-all cursor-pointer opacity-70 hover:opacity-100 group">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {ticket.subject}
                              </CardTitle>
                              <CardDescription className="mt-2 text-xs space-y-1">
                                <div>Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR')}</div>
                                {ticket.closed_at && (
                                  <div>Fermé le {new Date(ticket.closed_at).toLocaleDateString('fr-FR')}</div>
                                )}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="shrink-0">
                              Fermé
                            </Badge>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;