import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Plus, Trash2, ExternalLink, Eye, EyeOff, Pencil, Save, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchAllDbPostsAdmin, type DbBlogPost } from '@/lib/blog-db';

const AdminBlogArticles = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();

  const [posts, setPosts] = useState<DbBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DbBlogPost | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const all = await fetchAllDbPostsAdmin();
    setPosts(all);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
    if (!adminLoading && user && !isAdmin) navigate('/');
    if (isAdmin) load();
  }, [user, isAdmin, authLoading, adminLoading]); // eslint-disable-line

  const togglePublish = async (p: DbBlogPost) => {
    const next = p.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase
      .from('blog_posts' as any)
      .update({
        status: next,
        published_at: next === 'published' ? new Date().toISOString() : null,
      } as any)
      .eq('id', p.id);
    if (error) return toast.error(error.message);
    toast.success(next === 'published' ? 'Article publié' : 'Article dépublié');
    load();
  };

  const remove = async (p: DbBlogPost) => {
    if (!confirm(`Supprimer définitivement "${p.title}" ?`)) return;
    const { error } = await supabase.from('blog_posts' as any).delete().eq('id', p.id);
    if (error) return toast.error(error.message);
    toast.success('Article supprimé');
    load();
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    const { error } = await supabase
      .from('blog_posts' as any)
      .update({
        title: editing.title,
        slug: editing.slug,
        meta_title: editing.meta_title,
        meta_description: editing.meta_description,
        excerpt: editing.excerpt,
        content: editing.content,
        keywords: editing.keywords,
        category: editing.category,
      } as any)
      .eq('id', editing.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success('Modifications enregistrées');
    setEditing(null);
    load();
  };

  if (authLoading || adminLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Accueil
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Articles de blog (IA)</h1>
          <Button onClick={() => navigate('/admin/blog-generator')}>
            <Plus className="w-4 h-4 mr-2" /> Nouveau
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{posts.length} article(s) généré(s)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : posts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Aucun article généré pour le moment.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Créé</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium max-w-xs truncate">{p.title}</TableCell>
                        <TableCell><Badge variant="outline">{p.category}</Badge></TableCell>
                        <TableCell>
                          <Badge variant={p.status === 'published' ? 'default' : 'secondary'}>
                            {p.status === 'published' ? 'Publié' : 'Brouillon'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(p.created_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="icon" variant="ghost" asChild title="Voir">
                              <Link to={`/blog/${p.slug}`} target="_blank"><ExternalLink className="w-4 h-4" /></Link>
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => togglePublish(p)} title={p.status === 'published' ? 'Dépublier' : 'Publier'}>
                              {p.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => setEditing(p)} title="Modifier">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => remove(p)} title="Supprimer">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'article</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Titre</label>
                <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Slug</label>
                  <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium">Catégorie</label>
                  <Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Meta title</label>
                <Input value={editing.meta_title} onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Meta description</label>
                <Textarea rows={2} value={editing.meta_description} onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Mots-clés (séparés par virgule)</label>
                <Input value={(editing.keywords || []).join(', ')} onChange={(e) => setEditing({ ...editing, keywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
              </div>
              <div>
                <label className="text-sm font-medium">Extrait</label>
                <Textarea rows={2} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Contenu (Markdown)</label>
                <Textarea rows={18} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className="font-mono text-xs" />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setEditing(null)}><X className="w-4 h-4 mr-1" /> Annuler</Button>
                <Button onClick={saveEdit} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                  Enregistrer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminBlogArticles;
