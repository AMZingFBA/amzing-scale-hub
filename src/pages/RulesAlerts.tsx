import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useNotifications } from '@/hooks/use-notifications';
import { supabase } from '@/integrations/supabase/client';
import { Capacitor } from '@capacitor/core';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Link2, Image, Video, Mic, FileText, ArrowLeft, Shield, Users, AlertCircle, Scale, Database, UserCog, Lock, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RulesAlerts = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { markAsRead } = useNotifications();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('base');
  const isNativeApp = Capacitor.isNativePlatform();

  const loadAlerts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('admin_alerts')
        .select('*')
        .eq('category', 'introduction')
        .eq('subcategory', 'règles')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Show all alerts
      if (data) {
        setAlerts(data);
        
        // Count unread alerts
        let unread = 0;
        for (const alert of data) {
          const { data: readStatus } = await supabase
            .from('alert_read_status')
            .select('is_read')
            .eq('alert_id', alert.id)
            .eq('user_id', user.id)
            .eq('is_read', true)
            .maybeSingle();
          
          if (!readStatus) {
            unread++;
          }
        }
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark alerts as read when user visits the page
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        console.log('🔴 Marking alerts as read on page visit');
        markAsRead('introduction', 'règles');
        // Update unread count after marking as read
        setTimeout(() => {
          setUnreadCount(0);
        }, 1000);
      }, 1000); // Small delay to ensure user actually views the page
      return () => clearTimeout(timer);
    }
  }, [user, markAsRead]);

  // Real-time subscription for new alerts
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('rules-alerts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_alerts',
          filter: `category=eq.introduction,subcategory=eq.règles`
        },
        () => {
          loadAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const rules = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Respect et professionnalisme",
      content: "Tous les échanges doivent rester courtois et constructifs. Les insultes, propos haineux, discriminatoires ou inappropriés sont strictement interdits et peuvent entraîner une suspension immédiate du compte."
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Confidentialité et sécurité",
      content: "Il est interdit de partager des informations personnelles sensibles (coordonnées bancaires, mots de passe, etc.). Respectez la confidentialité des autres membres et ne divulguez aucune donnée privée."
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      title: "Contenu interdit",
      content: "La publication de contenu illégal, frauduleux, pornographique ou incitant à la violence est strictement interdite. Tout manquement entraînera une exclusion définitive de la plateforme."
    },
    {
      icon: <Scale className="w-5 h-5" />,
      title: "Transactions équitables",
      content: "Les transactions sur la marketplace doivent être honnêtes et conformes. Toute tentative de fraude, d'arnaque ou de manipulation des prix sera sanctionnée."
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Propriété intellectuelle",
      content: "Ne partagez pas de contenus protégés par des droits d'auteur sans autorisation. Respectez la propriété intellectuelle d'autrui et n'utilisez les ressources partagées que dans le cadre légal."
    },
    {
      icon: <UserCog className="w-5 h-5" />,
      title: "Utilisation responsable",
      content: "N'utilisez pas la plateforme pour du spam, de la publicité non sollicitée ou des activités nuisibles. Gardez vos échanges pertinents et en lien avec l'activité e-commerce."
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Sécurité du compte",
      content: "Vous êtes responsable de la sécurité de votre compte. N'utilisez pas de comptes multiples et ne partagez jamais vos identifiants. Toute activité suspecte doit être signalée immédiatement."
    }
  ];

  useEffect(() => {
    if (!user && !isAuthLoading) {
      navigate('/auth');
      return;
    }

    if (user) {
      loadAlerts();
    }
  }, [user, isAuthLoading, navigate]);

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Mic className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20">
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </main>
        {!isNativeApp && <Footer />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-6 group"
          >
            <ChevronLeft className="w-5 h-5 mr-2 text-yellow-500 group-hover:text-yellow-600 transition-colors" />
            <span>Retour au Dashboard</span>
          </Button>

          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Règles d'utilisation</h1>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="base">Règles de base</TabsTrigger>
              <TabsTrigger value="updates" className="relative">
                Mises à jour
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="base" className="space-y-4">
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Afin de garantir un environnement sûr, professionnel et collaboratif, chaque membre s'engage à respecter les règles d'utilisation ci-dessous. En accédant à AMZing FBA, vous confirmez avoir lu, compris et accepté l'ensemble de ces conditions.
                  </p>
                </CardContent>
              </Card>

              {rules.map((rule, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-base">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {rule.icon}
                      </div>
                      <span>{index + 1}. {rule.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {rule.content}
                    </p>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    Merci de contribuer à faire d'AMZing FBA un espace professionnel, fiable et performant 💪
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="updates" className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : alerts.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Aucune mise à jour pour le moment</p>
                  </CardContent>
                </Card>
              ) : (
                alerts.map((alert) => (
                  <Card key={alert.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-xl font-semibold">{alert.title}</h2>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {new Date(alert.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </Badge>
                      </div>

                      {alert.content && (
                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {alert.content}
                        </p>
                      )}

                      {alert.link_url && (
                        <a
                          href={alert.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline font-medium"
                        >
                          <Link2 className="w-4 h-4" />
                          Voir le lien
                        </a>
                      )}

                      {alert.file_url && (
                        <div className="space-y-3">
                          {alert.file_type === 'image' && (
                            <img
                              src={alert.file_url}
                              alt={alert.file_name}
                              className="w-full rounded-lg border"
                            />
                          )}
                          {alert.file_type === 'video' && (
                            <video
                              src={alert.file_url}
                              controls
                              className="w-full rounded-lg border"
                            />
                          )}
                          {alert.file_type === 'audio' && (
                            <audio src={alert.file_url} controls className="w-full" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {getFileIcon(alert.file_type)}
                            <span className="ml-2">{alert.file_name}</span>
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      {!isNativeApp && <Footer />}
    </div>
  );
};

export default RulesAlerts;
