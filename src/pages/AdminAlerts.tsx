import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Link2, Image, Video, Mic, FileText, AlertCircle, Edit2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const AdminAlerts = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('introduction');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  // Edit state
  const [editingAlert, setEditingAlert] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editLinkUrl, setEditLinkUrl] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editSubcategory, setEditSubcategory] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!isAdminLoading && !isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }

    if (isAdmin) {
      loadAlerts();
      
      const alertsChannel = supabase
        .channel('admin-alerts')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'admin_alerts'
          },
          () => {
            loadAlerts();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(alertsChannel);
      };
    }
  }, [user, isAdmin, isAdminLoading, navigate]);

  const loadAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les alertes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = {
    introduction: ['notifications', 'règles', 'guides', 'affiliation'],
    outils: ['création-société', 'facture-autorisation', 'cashback', 'avis', 'fiscalité-simplifiée'],
    expedition: ['fournitures', 'cartons'],
    informations: ['annonces', 'actualités'],
    produits: ['produits-find', 'produits-qogita', 'produits-eany', 'grossistes', 'promotions', 'sitelist'],
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview for images and videos
      if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const getFileType = (file: File): string => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-alerts')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-alerts')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const getChatRoomName = (subcategory: string) => {
    switch (subcategory) {
      case 'produits-find': return 'Product Find';
      case 'produits-qogita': return 'Produits Qogita';
      case 'produits-eany': return 'Produits Eany';
      case 'grossistes': return 'Grossistes';
      case 'promotions': return 'Promotions';
      case 'sitelist': return 'Sitelist';
      default: return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre est requis",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let fileUrl = null;
      let fileType = null;
      let fileName = null;

      if (file) {
        fileUrl = await uploadFile(file);
        fileType = getFileType(file);
        fileName = file.name;
      }

      const { data: newAlert, error } = await supabase
        .from('admin_alerts')
        .insert({
          admin_id: user?.id,
          title: title.trim(),
          content: content.trim() || null,
          link_url: linkUrl.trim() || null,
          file_url: fileUrl,
          file_type: fileType,
          file_name: fileName,
          category: selectedCategory,
          subcategory: selectedSubcategory || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Envoyer les notifications push
      if (newAlert) {
        try {
          console.log('📤 Calling send-push-notifications...', {
            alert_id: newAlert.id,
            title: newAlert.title,
            category: newAlert.category,
            subcategory: newAlert.subcategory
          });

          const { data: pushData, error: pushError } = await supabase.functions.invoke('send-push-notifications', {
            body: {
              alert_id: newAlert.id,
              title: newAlert.title,
              category: newAlert.category,
              subcategory: newAlert.subcategory
            }
          });

          if (pushError) {
            console.error('❌ Error sending push notifications:', pushError);
          } else {
            console.log('✅ Push notifications sent successfully:', pushData);
          }
        } catch (pushError) {
          console.error('❌ Exception sending push notifications:', pushError);
        }
      }

      // Si c'est une alerte produits avec une sous-catégorie, poster dans le chat room correspondant
      if (selectedCategory === 'produits' && selectedSubcategory) {
        const roomName = getChatRoomName(selectedSubcategory);
        if (roomName) {
          try {
            // Trouver le chat room correspondant
            const { data: roomData, error: roomError } = await supabase
              .from('chat_rooms')
              .select('id')
              .eq('name', roomName)
              .eq('type', 'products')
              .single();

            if (!roomError && roomData) {
              // Créer un message dans ce chat room
              let messageContent = `📢 **${title.trim()}**\n\n`;
              if (content.trim()) {
                messageContent += `${content.trim()}\n\n`;
              }
              if (linkUrl.trim()) {
                messageContent += `🔗 ${linkUrl.trim()}`;
              }

              const { error: messageError } = await supabase
                .from('chat_messages')
                .insert({
                  room_id: roomData.id,
                  user_id: user?.id,
                  content: messageContent,
                  file_url: fileUrl,
                  file_name: fileName,
                  message_type: fileType || 'text',
                });

              if (messageError) {
                console.error('Error posting to chat:', messageError);
              }
            }
          } catch (chatError) {
            console.error('Error finding chat room:', chatError);
          }
        }
      }

      toast({
        title: "Alerte publiée",
        description: "L'alerte a été publiée avec succès",
      });

      // Reset form
      setTitle('');
      setContent('');
      setLinkUrl('');
      setFile(null);
      setFilePreview(null);
      setSelectedCategory('introduction');
      setSelectedSubcategory('');
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier l'alerte",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAlert = async (alertId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) return;

    try {
      console.log('🗑️ Attempting to delete alert:', alertId);
      console.log('👤 User ID:', user?.id);
      console.log('🔐 Is Admin:', isAdmin);
      
      const { data, error } = await supabase
        .from('admin_alerts')
        .delete()
        .eq('id', alertId)
        .select();

      if (error) {
        console.error('❌ Delete error:', error);
        throw error;
      }

      console.log('✅ Alert deleted successfully:', data);
      
      toast({
        title: "Alerte supprimée",
        description: "L'alerte a été supprimée avec succès",
      });

      // Recharger la liste des alertes
      await loadAlerts();
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'alerte",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (alert: any) => {
    setEditingAlert(alert);
    setEditTitle(alert.title);
    setEditContent(alert.content || '');
    setEditLinkUrl(alert.link_url || '');
    setEditCategory(alert.category || 'introduction');
    setEditSubcategory(alert.subcategory || '');
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editTitle.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre est requis",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('admin_alerts')
        .update({
          title: editTitle.trim(),
          content: editContent.trim() || null,
          link_url: editLinkUrl.trim() || null,
          category: editCategory,
          subcategory: editSubcategory || null,
        })
        .eq('id', editingAlert.id);

      if (error) throw error;

      toast({
        title: "Alerte modifiée",
        description: "L'alerte a été modifiée avec succès",
      });

      setEditDialogOpen(false);
      setEditingAlert(null);

    } catch (error) {
      console.error('Error updating alert:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'alerte",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAlertLocation = (category: string | null, subcategory?: string | null) => {
    const categoryLabels: Record<string, string> = {
      introduction: 'Introduction',
      outils: 'Outils',
      expedition: 'Expédition',
      informations: 'Informations',
      produits: 'Produits Gagnants',
    };
    
    if (!category) {
      return 'Dashboard (général)';
    }
    
    const baseLocation = categoryLabels[category] || category;
    
    if (subcategory) {
      return `${baseLocation} › ${subcategory}`;
    }
    
    return `${baseLocation} (toutes les sous-catégories)`;
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Mic className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (isLoading || isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <h1 className="text-4xl font-bold mb-2">Alertes Admin</h1>
          <p className="text-muted-foreground mb-8">
            Publier des alertes dans toutes les catégories
          </p>

          {/* Form to create new alert */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nouvelle Alerte
              </CardTitle>
              <CardDescription>
                Partagez des informations, produits ou actualités dans n'importe quelle catégorie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Catégorie *</Label>
                    <select
                      id="category"
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedSubcategory('');
                      }}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="introduction">Introduction</option>
                      <option value="outils">Outils</option>
                      <option value="expedition">Expédition</option>
                      <option value="informations">Informations</option>
                      <option value="produits">Produits Gagnants</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="subcategory">Sous-catégorie (optionnel)</Label>
                    <select
                      id="subcategory"
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">Toutes</option>
                      {categories[selectedCategory as keyof typeof categories]?.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Nouvelle information importante..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Description</Label>
                  <Textarea
                    id="content"
                    placeholder="Détails, stratégie, conseils..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="link">Lien (optionnel)</Label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="link"
                      type="url"
                      placeholder="https://..."
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="file-upload">Fichier (image, vidéo, audio)</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*,video/*,audio/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {filePreview && (
                    <div className="mt-4">
                      {file?.type.startsWith('image/') && (
                        <img src={filePreview} alt="Preview" className="max-w-xs rounded-lg" />
                      )}
                      {file?.type.startsWith('video/') && (
                        <video src={filePreview} controls className="max-w-xs rounded-lg" />
                      )}
                    </div>
                  )}
                  {file && file.type.startsWith('audio/') && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Fichier audio sélectionné: {file.name}
                    </p>
                  )}
                </div>

                <Button type="submit" variant="hero" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publication...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Publier l'alerte
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* List of existing alerts */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Alertes publiées</h2>
              <Badge variant="secondary" className="text-lg px-4 py-1">
                {alerts.length} {alerts.length > 1 ? 'alertes' : 'alerte'}
              </Badge>
            </div>
            
            {alerts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-12 pb-12 text-center">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-lg text-muted-foreground">Aucune alerte publiée</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Utilisez le formulaire ci-dessus pour créer votre première alerte
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {alerts.map((alert) => (
                  <Card key={alert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex">
                      {/* Sidebar colorée selon la catégorie */}
                      <div 
                        className="w-2 flex-shrink-0"
                        style={{
                          backgroundColor: 
                            alert.category === 'introduction' ? '#3b82f6' :
                            alert.category === 'outils' ? '#8b5cf6' :
                            alert.category === 'expedition' ? '#f59e0b' :
                            alert.category === 'informations' ? '#ef4444' :
                            alert.category === 'produits' ? '#10b981' : '#6b7280'
                        }}
                      />
                      
                      <div className="flex-1">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <MapPin className="w-3 h-3 text-primary" />
                                <span className="text-sm font-semibold text-primary">
                                  📍 {getAlertLocation(alert.category, alert.subcategory)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs font-medium"
                                  style={{
                                    backgroundColor: 
                                      alert.category === 'introduction' ? '#dbeafe' :
                                      alert.category === 'outils' ? '#ede9fe' :
                                      alert.category === 'expedition' ? '#fef3c7' :
                                      alert.category === 'informations' ? '#fee2e2' :
                                      alert.category === 'produits' ? '#d1fae5' : '#f3f4f6',
                                    color: 
                                      alert.category === 'introduction' ? '#1e40af' :
                                      alert.category === 'outils' ? '#6d28d9' :
                                      alert.category === 'expedition' ? '#b45309' :
                                      alert.category === 'informations' ? '#b91c1c' :
                                      alert.category === 'produits' ? '#047857' : '#374151'
                                  }}
                                >
                                  {alert.category ? alert.category.toUpperCase() : 'GÉNÉRAL'}
                                </Badge>
                                {alert.subcategory && (
                                  <Badge variant="outline" className="text-xs">
                                    {alert.subcategory}
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  • {new Date(alert.created_at).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              
                              <CardTitle className="text-xl">{alert.title}</CardTitle>
                            </div>
                            
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(alert)}
                                className="hover:bg-primary/10 hover:text-primary"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteAlert(alert.id)}
                                className="hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          {alert.content && (
                            <div className="bg-muted/50 rounded-lg p-4">
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                {alert.content}
                              </p>
                            </div>
                          )}
                          
                          {alert.link_url && (
                            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                              <Link2 className="w-4 h-4 text-primary flex-shrink-0" />
                              <a
                                href={alert.link_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline font-medium truncate"
                              >
                                {alert.link_url}
                              </a>
                            </div>
                          )}

                          {alert.file_url && (
                            <div className="space-y-3">
                              {alert.file_type === 'image' && (
                                <div className="relative rounded-lg overflow-hidden border">
                                  <img
                                    src={alert.file_url}
                                    alt={alert.file_name}
                                    className="w-full max-h-96 object-contain bg-muted"
                                  />
                                </div>
                              )}
                              {alert.file_type === 'video' && (
                                <div className="relative rounded-lg overflow-hidden border">
                                  <video
                                    src={alert.file_url}
                                    controls
                                    className="w-full max-h-96 bg-black"
                                  />
                                </div>
                              )}
                              {alert.file_type === 'audio' && (
                                <div className="bg-muted/50 p-4 rounded-lg border">
                                  <audio src={alert.file_url} controls className="w-full" />
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {getFileIcon(alert.file_type)}
                                <span className="truncate">{alert.file_name}</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'alerte</DialogTitle>
            <DialogDescription>
              Modifiez les informations de votre alerte
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Catégorie *</Label>
                <select
                  id="edit-category"
                  value={editCategory}
                  onChange={(e) => {
                    setEditCategory(e.target.value);
                    setEditSubcategory('');
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="introduction">Introduction</option>
                  <option value="outils">Outils</option>
                  <option value="expedition">Expédition</option>
                  <option value="informations">Informations</option>
                  <option value="produits">Produits Gagnants</option>
                </select>
              </div>

              <div>
                <Label htmlFor="edit-subcategory">Sous-catégorie</Label>
                <select
                  id="edit-subcategory"
                  value={editSubcategory}
                  onChange={(e) => setEditSubcategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Toutes</option>
                  {categories[editCategory as keyof typeof categories]?.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-title">Titre *</Label>
              <Input
                id="edit-title"
                placeholder="Titre de l'alerte"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-content">Description</Label>
              <Textarea
                id="edit-content"
                placeholder="Détails..."
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="edit-link">Lien</Label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="edit-link"
                  type="url"
                  placeholder="https://..."
                  value={editLinkUrl}
                  onChange={(e) => setEditLinkUrl(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" variant="hero" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Modification...
                  </>
                ) : (
                  'Enregistrer'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAlerts;
