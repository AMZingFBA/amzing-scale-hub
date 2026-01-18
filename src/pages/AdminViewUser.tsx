import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertTriangle, Crown, Eye, Clock, RefreshCw, Shield, User, Mail, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

interface UserData {
  id: string;
  full_name: string;
  email: string;
  nickname: string | null;
}

interface SubscriptionData {
  plan_type: string;
  status: string;
  expires_at: string | null;
  is_trial: boolean;
}

const AdminViewUser = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);
  const [currentToken, setCurrentToken] = useState<string | null>(token);

  const validateToken = useCallback(async (tokenToValidate: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-impersonation', {
        body: { action: 'validate', impersonationToken: tokenToValidate }
      });

      if (error || !data.valid) {
        setError(data?.error || 'Lien invalide ou expiré');
        setLoading(false);
        return;
      }

      setUser(data.user);
      setSubscription(data.subscription);
      setExpiresAt(new Date(data.expiresAt));
      setLoading(false);
    } catch (err) {
      console.error('Error validating token:', err);
      setError('Erreur lors de la validation du lien');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setError('Aucun token fourni');
      setLoading(false);
      return;
    }

    validateToken(token);
  }, [token, validateToken]);

  // Timer countdown
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const remaining = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        setError('Le lien a expiré');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleRefresh = async () => {
    if (!currentToken) return;
    
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-impersonation', {
        body: { action: 'refresh', impersonationToken: currentToken }
      });

      if (error || !data.success) {
        toast.error('Impossible de prolonger la session');
        return;
      }

      // Update URL with new token without reloading
      const newUrl = `${window.location.pathname}?token=${data.token}`;
      window.history.replaceState({}, '', newUrl);
      
      setCurrentToken(data.token);
      setExpiresAt(new Date(data.expiresAt));
      toast.success('Session prolongée de 5 minutes');
    } catch (err) {
      console.error('Error refreshing token:', err);
      toast.error('Erreur lors du rafraîchissement');
    } finally {
      setRefreshing(false);
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Validation du lien...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Lien Invalide</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => navigate('/admin/profiles')} variant="outline">
                Retour à la gestion des profils
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isVIP = subscription?.plan_type === 'vip' && subscription?.status === 'active';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      {/* Timer Bar */}
      <div className="fixed top-0 left-0 right-0 bg-destructive/10 border-b border-destructive/20 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="destructive" className="gap-1">
              <Eye className="w-3 h-3" />
              Mode Admin
            </Badge>
            <span className="text-sm text-muted-foreground">
              Vue de: <strong>{user?.full_name || user?.email}</strong>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${timeRemaining <= 60 ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
              <span className={`font-mono text-sm ${timeRemaining <= 60 ? 'text-destructive font-bold' : ''}`}>
                {formatTimeRemaining(timeRemaining)}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2"
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Prolonger
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate('/admin/profiles')}
            >
              Fermer
            </Button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-destructive/20">
          <div 
            className="h-full bg-destructive transition-all duration-1000"
            style={{ width: `${Math.min(100, (timeRemaining / 300) * 100)}%` }}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto pt-20">
        <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
          <Shield className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-500">Mode Administrateur</AlertTitle>
          <AlertDescription>
            Vous visualisez ce que voit l'utilisateur <strong>{user?.full_name || user?.email}</strong>. 
            Ce lien expire dans {formatTimeRemaining(timeRemaining)}. Cliquez sur "Prolonger" pour ajouter 5 minutes.
          </AlertDescription>
        </Alert>

        {/* User Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              Informations Utilisateur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Nom</div>
                  <div className="font-medium">{user?.full_name || 'Non renseigné'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{user?.email}</div>
                </div>
              </div>
              {user?.nickname && (
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Pseudo</div>
                    <div className="font-medium">@{user.nickname}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Crown className={`w-5 h-5 ${isVIP ? 'text-yellow-500' : 'text-muted-foreground'}`} />
              Statut Abonnement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              {isVIP ? (
                <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-lg py-2 px-4">
                  <Crown className="w-5 h-5 mr-2" />
                  VIP ACTIF
                </Badge>
              ) : subscription?.plan_type === 'vip' ? (
                <Badge variant="secondary" className="text-lg py-2 px-4">
                  VIP {subscription.status === 'canceled' ? 'Annulé' : 'Inactif'}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-lg py-2 px-4">
                  Compte Gratuit
                </Badge>
              )}
            </div>
            
            {subscription?.expires_at && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {isVIP ? 'Expire le' : 'Expiré le'}: {new Date(subscription.expires_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* What user sees */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-primary" />
              Accès de l'utilisateur
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isVIP ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Accès complet aux alertes produits
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Accès aux produits Qogita/Eany
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Accès au marketplace
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Accès au chat communautaire
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Support prioritaire
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  Accès limité au dashboard
                </div>
                <div className="flex items-center gap-2 text-red-500">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  Pas d'accès aux alertes produits
                </div>
                <div className="flex items-center gap-2 text-red-500">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  Pas d'accès aux produits Qogita/Eany
                </div>
                <div className="flex items-center gap-2 text-red-500">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  Pas d'accès au marketplace
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminViewUser;
