import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Plus, RefreshCw, Send, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/use-admin";
import { airtableContactsService, AirtableContact } from "@/services/airtableContactsService";

const AdminAirtableContacts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  
  const [contacts, setContacts] = useState<AirtableContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<AirtableContact | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    prenom: '',
    tag: 'Prospect',
    source: 'App',
    typeEmail: '',
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const data = await airtableContactsService.fetchContacts();
      setContacts(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les contacts Airtable",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchContacts();
    }
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContact) {
        await airtableContactsService.updateContact(editingContact.id, formData);
        toast({ title: "Contact mis à jour" });
      } else {
        await airtableContactsService.createContact(formData);
        toast({ title: "Contact créé" });
      }
      setIsDialogOpen(false);
      setEditingContact(null);
      setFormData({ email: '', prenom: '', tag: 'Prospect', source: 'App', typeEmail: '' });
      fetchContacts();
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Action échouée" });
    }
  };

  const handleEdit = (contact: AirtableContact) => {
    setEditingContact(contact);
    setFormData({
      email: contact.email,
      prenom: contact.prenom || '',
      tag: contact.tag || 'Prospect',
      source: contact.source || 'App',
      typeEmail: contact.typeEmail || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (recordId: string) => {
    if (!confirm('Supprimer ce contact ?')) return;
    try {
      await airtableContactsService.deleteContact(recordId);
      toast({ title: "Contact supprimé" });
      fetchContacts();
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur" });
    }
  };

  const handleMarkAsSent = async (recordId: string) => {
    try {
      await airtableContactsService.markAsSent(recordId);
      toast({ title: "Marqué comme envoyé" });
      fetchContacts();
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur" });
    }
  };

  const getTagColor = (tag?: string) => {
    switch (tag) {
      case 'VIP': return 'bg-primary text-primary-foreground';
      case 'Prospect': return 'bg-blue-500 text-white';
      case 'Test': return 'bg-gray-500 text-white';
      case 'Ancien client Amazon': return 'bg-purple-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (adminLoading || isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="fixed top-[140px] left-4 z-50 text-primary hover:scale-110 transition-transform"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <div className="max-w-6xl mx-auto pt-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Mail className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Contacts Airtable</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchContacts}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingContact(null); setFormData({ email: '', prenom: '', tag: 'Prospect', source: 'App', typeEmail: '' }); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingContact ? 'Modifier le contact' : 'Nouveau contact'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Email *</Label>
                    <Input 
                      type="email" 
                      value={formData.email} 
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      required 
                    />
                  </div>
                  <div>
                    <Label>Prénom</Label>
                    <Input 
                      value={formData.prenom} 
                      onChange={e => setFormData({ ...formData, prenom: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Tag</Label>
                    <Select value={formData.tag} onValueChange={v => setFormData({ ...formData, tag: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="Prospect">Prospect</SelectItem>
                        <SelectItem value="Test">Test</SelectItem>
                        <SelectItem value="Ancien client Amazon">Ancien client Amazon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Source</Label>
                    <Select value={formData.source} onValueChange={v => setFormData({ ...formData, source: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="App">App</SelectItem>
                        <SelectItem value="Formulaire site">Formulaire site</SelectItem>
                        <SelectItem value="Amazon">Amazon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Type d'email</Label>
                    <Input 
                      value={formData.typeEmail} 
                      onChange={e => setFormData({ ...formData, typeEmail: e.target.value })}
                      placeholder="Bienvenue, Newsletter, etc."
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingContact ? 'Mettre à jour' : 'Créer'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{contacts.length} contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contacts.map(contact => (
                <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{contact.email}</span>
                      {contact.tag && <Badge className={getTagColor(contact.tag)}>{contact.tag}</Badge>}
                      {contact.statutEnvoi && (
                        <Badge variant={contact.statutEnvoi === 'Envoyé' ? 'secondary' : 'outline'}>
                          {contact.statutEnvoi}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {contact.prenom && <span>{contact.prenom} • </span>}
                      {contact.source && <span>Source: {contact.source}</span>}
                      {contact.dernierEnvoi && <span> • Dernier envoi: {new Date(contact.dernierEnvoi).toLocaleDateString('fr-FR')}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {contact.statutEnvoi !== 'Envoyé' && (
                      <Button size="sm" variant="outline" onClick={() => handleMarkAsSent(contact.id)}>
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleEdit(contact)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(contact.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {contacts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Aucun contact dans Airtable</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAirtableContacts;
