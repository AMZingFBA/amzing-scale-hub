import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@capawesome/capacitor-badge';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';
import { RefreshCw, Send, Trash2 } from 'lucide-react';

export default function DebugPushNotifications() {
  const { user } = useAuth();
  const [tokens, setTokens] = useState<any[]>([]);
  const [badgeCountDB, setBadgeCountDB] = useState<number>(0);
  const [badgeCountIOS, setBadgeCountIOS] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Récupérer les tokens
      const { data: tokensData, error: tokensError } = await supabase
        .from('push_notification_tokens')
        .select('*')
        .eq('user_id', user.id);

      if (tokensError) throw tokensError;
      setTokens(tokensData || []);

      // Récupérer le badge count en DB
      const { data: badgeData, error: badgeError } = await supabase
        .from('user_badge_counts')
        .select('badge_count')
        .eq('user_id', user.id)
        .single();

      if (badgeError && badgeError.code !== 'PGRST116') {
        console.error('Error fetching badge count:', badgeError);
      }
      setBadgeCountDB(badgeData?.badge_count || 0);

      // Récupérer le badge count iOS
      if (isNative) {
        const iosBadge = await Badge.get();
        setBadgeCountIOS(iosBadge.count || 0);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleResetBadge = async () => {
    if (!user) return;
    
    try {
      // Reset en DB
      const { error: dbError } = await supabase.rpc('reset_user_badge', {
        user_id_param: user.id
      });

      if (dbError) throw dbError;

      // Reset iOS
      if (isNative) {
        await Badge.set({ count: 0 });
      }

      toast.success('Badge réinitialisé !');
      await loadData();
    } catch (error) {
      console.error('Error resetting badge:', error);
      toast.error('Erreur lors de la réinitialisation');
    }
  };

  const handleDeleteToken = async (tokenId: string) => {
    try {
      const { error } = await supabase
        .from('push_notification_tokens')
        .delete()
        .eq('id', tokenId);

      if (error) throw error;

      toast.success('Token supprimé !');
      await loadData();
    } catch (error) {
      console.error('Error deleting token:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleTestNotification = async () => {
    if (!user) return;
    
    try {
      toast.info('Test notification envoyé - vérifiez votre appareil');
      
      // Incrémenter le badge manuellement pour le test
      const { error } = await supabase.rpc('increment_user_badge', {
        user_id_param: user.id
      });

      if (error) throw error;

      await loadData();
    } catch (error) {
      console.error('Error testing notification:', error);
      toast.error('Erreur lors du test');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <p>Vous devez être connecté pour accéder à cette page</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Debug Push Notifications</h1>
        <Button onClick={loadData} disabled={loading} size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Rafraîchir
        </Button>
      </div>

      <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
        <CardHeader>
          <CardTitle className="text-yellow-900 dark:text-yellow-100">⚠️ Attention</CardTitle>
          <CardDescription className="text-yellow-800 dark:text-yellow-200">
            Avant de tester, tu DOIS reset le badge à 0 !
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleResetBadge} variant="default" size="lg" className="w-full">
            <Trash2 className="w-4 h-4 mr-2" />
            🔴 RESET BADGE → 0 (obligatoire avant test)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations utilisateur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">User ID:</span>
            <span className="font-mono text-sm">{user.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Plateforme:</span>
            <span>{isNative ? Capacitor.getPlatform() : 'Web'}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badge Count</CardTitle>
          <CardDescription>État du compteur de badge</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Badge en DB:</span>
            <span className="text-2xl font-bold">{badgeCountDB}</span>
          </div>
          {isNative && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Badge iOS:</span>
              <span className="text-2xl font-bold">{badgeCountIOS}</span>
            </div>
          )}
          <Button onClick={handleResetBadge} variant="destructive" className="w-full">
            <Trash2 className="w-4 h-4 mr-2" />
            Forcer le reset du badge
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tokens Push ({tokens.length})</CardTitle>
          <CardDescription>Tokens FCM enregistrés</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {tokens.length === 0 ? (
            <p className="text-muted-foreground">Aucun token enregistré</p>
          ) : (
            tokens.map((token) => (
              <div key={token.id} className="border p-3 rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{token.platform}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(token.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <code className="text-xs break-all">{token.token}</code>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteToken(token.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tests</CardTitle>
          <CardDescription>Tester les fonctionnalités</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleTestNotification} className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Incrémenter le badge (simuler notification)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
