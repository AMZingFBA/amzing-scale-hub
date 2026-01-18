import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Capacitor } from '@capacitor/core';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, User, Mail, Phone, Edit2, Save, Loader2, Lock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NotificationSettings } from '@/components/NotificationSettings';

interface ProfileData {
  full_name: string | null;
  nickname: string | null;
  phone: string | null;
  avatar_url: string | null;
  email: string;
}

const Profile = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    nickname: '',
    phone: '',
    avatar_url: '',
    email: '',
  });
  const isNativeApp = Capacitor.isNativePlatform();

  // Reset code state when dialogs are opened
  useEffect(() => {
    if (showEmailDialog || showPasswordDialog || showPhoneDialog || showCancelDialog || showDeleteDialog) {
      setCodeSent(false);
      setVerificationCode('');
    }
  }, [showEmailDialog, showPasswordDialog, showPhoneDialog, showCancelDialog, showDeleteDialog]);

  useEffect(() => {
    if (!user && !isAuthLoading) {
      navigate('/auth');
      return;
    }

    if (user) {
      loadProfile();
      loadSubscription();
    }
  }, [user, isAuthLoading, navigate]);

  const loadSubscription = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          nickname: data.nickname || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || '',
          email: data.email || user.email || '',
        });
      } else {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              email: user.email || '',
            },
          ]);

        if (insertError) throw insertError;

        setProfileData({
          full_name: '',
          nickname: '',
          phone: '',
          avatar_url: '',
          email: user.email || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger votre profil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name || null,
          nickname: profileData.nickname || null,
          phone: profileData.phone || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    if (profileData.full_name) {
      const names = profileData.full_name.split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (profileData.nickname) {
      return profileData.nickname.slice(0, 2).toUpperCase();
    }
    return profileData.email.slice(0, 2).toUpperCase();
  };

  const handleSendEmailCode = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un email valide",
        variant: "destructive",
      });
      return;
    }

    if (!profileData.phone) {
      toast({
        title: "Téléphone requis",
        description: "Veuillez d'abord ajouter un numéro de téléphone à votre profil",
        variant: "destructive",
      });
      return;
    }

    setIsSendingCode(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      const { data, error } = await supabase.functions.invoke('send-verification-code', {
        body: { type: 'email_change', newValue: newEmail },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      setCodeSent(true);
      toast({
        title: "Code envoyé",
      });
    } catch (error: any) {
      console.error('Error sending code:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le code",
        variant: "destructive",
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSendPasswordCode = async () => {
    console.log('handleSendPasswordCode called, newPassword length:', newPassword?.length);
    
    if (!newPassword || newPassword.length < 6) {
      console.log('Password validation failed');
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    console.log('About to call send-verification-code edge function');
    setIsSendingCode(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      const { data, error } = await supabase.functions.invoke('send-verification-code', {
        body: { type: 'password_change' },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) throw error;

      setCodeSent(true);
      toast({
        title: "Code envoyé",
      });
    } catch (error: any) {
      console.error('Error sending code:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le code",
        variant: "destructive",
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un code à 6 chiffres",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      const response = await supabase.functions.invoke('verify-and-update', {
        body: { code: verificationCode, type: 'email_change' },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        // Try to get error message from response data
        const errorMessage = response.data?.error || "Code invalide ou expiré";
        throw new Error(errorMessage);
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: "Email modifié",
        description: "Votre adresse email a été mise à jour avec succès",
      });

      setShowEmailDialog(false);
      setNewEmail('');
      setVerificationCode('');
      setCodeSent(false);
      
      // Refresh profile
      await loadProfile();
      
      // Sign out user to re-authenticate with new email
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      console.error('Error verifying code:', error);
      
      let errorMessage = "Code invalide ou expiré";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Code incorrect",
        description: errorMessage,
        variant: "destructive",
        duration: 7000,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyPasswordCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un code à 6 chiffres",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      const response = await supabase.functions.invoke('verify-and-update', {
        body: { code: verificationCode, type: 'password_change', newPassword },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        // Try to get error message from response data
        const errorMessage = response.data?.error || "Code invalide ou expiré";
        throw new Error(errorMessage);
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès",
      });

      setShowPasswordDialog(false);
      setNewPassword('');
      setVerificationCode('');
      setCodeSent(false);
    } catch (error: any) {
      console.error('Error verifying code:', error);
      
      let errorMessage = "Code invalide ou expiré";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Code incorrect",
        description: errorMessage,
        variant: "destructive",
        duration: 7000,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSendPhoneCode = async () => {
    if (!newPhone || newPhone.length < 10) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un numéro de téléphone valide",
        variant: "destructive",
      });
      return;
    }

    setIsSendingCode(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      const { data, error } = await supabase.functions.invoke('send-verification-code', {
        body: { type: 'phone_change', newValue: newPhone },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      setCodeSent(true);
      toast({
        title: "Code envoyé",
      });
    } catch (error: any) {
      console.error('Error sending code:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le code",
        variant: "destructive",
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyPhoneCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un code à 6 chiffres",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      const response = await supabase.functions.invoke('verify-and-update', {
        body: { code: verificationCode, type: 'phone_change' },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        const errorMessage = response.data?.error || "Code invalide ou expiré";
        throw new Error(errorMessage);
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: "Téléphone modifié",
        description: "Votre numéro de téléphone a été mis à jour avec succès",
      });

      setShowPhoneDialog(false);
      setNewPhone('');
      setVerificationCode('');
      setCodeSent(false);
      
      // Reload profile
      await loadProfile();
    } catch (error: any) {
      console.error('Error verifying code:', error);
      
      let errorMessage = "Code invalide ou expiré";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Code incorrect",
        description: errorMessage,
        variant: "destructive",
        duration: 7000,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSendCancelCode = async () => {
    setIsSendingCode(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      const { error } = await supabase.functions.invoke('send-verification-code', {
        body: { type: 'cancel_subscription' },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      setCodeSent(true);
      toast({
        title: "Code envoyé",
        description: "Un code de vérification a été envoyé à votre email",
      });
    } catch (error: any) {
      console.error('Error sending code:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le code",
        variant: "destructive",
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCancelCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un code à 6 chiffres",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      const response = await supabase.functions.invoke('cancel-subscription', {
        body: { code: verificationCode },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        const errorMessage = response.data?.error || "Code invalide ou expiré";
        throw new Error(errorMessage);
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: "Abonnement résilié",
        description: response.data?.message || "Votre abonnement a été résilié avec succès",
      });

      setShowCancelDialog(false);
      setShowCancelConfirmDialog(false);
      setVerificationCode('');
      setCodeSent(false);
      
      // Reload subscription
      await loadSubscription();
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      
      let errorMessage = "Code invalide ou expiré";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
        duration: 7000,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSendDeleteCode = async () => {
    setIsSendingCode(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      const { error } = await supabase.functions.invoke('send-verification-code', {
        body: { type: 'delete_account' },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      setCodeSent(true);
      toast({
        title: "Code envoyé",
        description: "Un code de vérification a été envoyé à votre email",
      });
    } catch (error: any) {
      console.error('Error sending code:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le code",
        variant: "destructive",
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyDeleteCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un code à 6 chiffres",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      const response = await supabase.functions.invoke('delete-account', {
        body: { code: verificationCode },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        const errorMessage = response.data?.error || "Code invalide ou expiré";
        throw new Error(errorMessage);
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé définitivement",
      });

      // Déconnexion et redirection
      await supabase.auth.signOut();
      navigate('/');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      
      let errorMessage = "Code invalide ou expiré";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
        duration: 7000,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading || isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-20">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-[#FF9900] hover:bg-[#FF9900]/90 p-3 md:p-2 rounded-full shadow-lg transition-all shrink-0 mb-6"
            aria-label="Retour au dashboard"
          >
            <ArrowLeft className="w-6 h-6 md:w-5 md:h-5 text-white" />
          </button>

          <div className="flex items-center gap-3 mb-8">
            <User className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Mon Profil</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Gérez vos informations personnelles
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profileData.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Modifiez vos informations de profil
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="bg-muted flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowEmailDialog(true)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Cliquez sur le bouton pour modifier votre email
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name">
                  <User className="w-4 h-4 inline mr-2" />
                  Nom complet
                </Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Jean Dupont"
                  value={profileData.full_name || ''}
                  onChange={(e) =>
                    setProfileData({ ...profileData, full_name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">
                  <Edit2 className="w-4 h-4 inline mr-2" />
                  Pseudonyme
                </Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="JeanD"
                  value={profileData.nickname || ''}
                  onChange={(e) =>
                    setProfileData({ ...profileData, nickname: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Téléphone
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={profileData.phone || ''}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowPhoneDialog(true)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  <Lock className="w-4 h-4 inline mr-2" />
                  Mot de passe
                </Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowPasswordDialog(true)}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Modifier le mot de passe
                </Button>
              </div>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full"
                size="lg"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          {!isLoadingSubscription && subscription && subscription.plan_type === 'vip' && subscription.status === 'active' && (
            <Card className="mt-6 border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Résiliation d'abonnement</CardTitle>
                <CardDescription>
                  Annulez votre abonnement VIP. Vous garderez l'accès jusqu'à la fin de la période.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                {subscription.expires_at && (
                    <p className="text-sm text-muted-foreground">
                      Prochain prélèvement le : {new Date(subscription.expires_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => setShowCancelConfirmDialog(true)}
                    className="w-full"
                  >
                    Résilier mon abonnement
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Canceled Subscription Notice */}
          {!isLoadingSubscription && subscription && subscription.status === 'canceled' && (
            <Card className="mt-6 border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
              <CardHeader>
                <CardTitle className="text-yellow-700 dark:text-yellow-500">Abonnement résilié</CardTitle>
                <CardDescription className="text-yellow-600 dark:text-yellow-400">
                  Votre abonnement a été résilié. Vous conservez l'accès VIP jusqu'au{' '}
                  {subscription.expires_at && new Date(subscription.expires_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Delete Account Section */}
          <Card className="mt-6 border-red-500/50 bg-red-50/50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-500">Zone dangereuse</CardTitle>
              <CardDescription className="text-red-600 dark:text-red-400">
                Supprimez définitivement votre compte et toutes vos données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-red-100 dark:bg-red-950/40 p-4 rounded-lg border border-red-300 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                    ⚠️ Attention : Cette action est irréversible
                  </p>
                  <ul className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1 list-disc list-inside">
                    <li>Tous vos messages seront supprimés</li>
                    <li>Votre profil sera définitivement effacé</li>
                    <li>Vos annonces marketplace seront retirées</li>
                    <li>Votre abonnement sera annulé</li>
                  </ul>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirmDialog(true)}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Supprimer mon compte définitivement
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Delete Account Confirmation Dialog */}
          <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer la suppression du compte</DialogTitle>
                <DialogDescription>
                  Êtes-vous absolument sûr de vouloir supprimer votre compte ?
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-200 font-bold">
                    ⛔ Cette action est DÉFINITIVE et IRRÉVERSIBLE
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                    Toutes vos données seront supprimées immédiatement et de manière permanente. 
                    Vous ne pourrez plus récupérer votre compte ou vos données.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirmDialog(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setShowDeleteConfirmDialog(false);
                      setShowDeleteDialog(true);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Je comprends, continuer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Account Verification Dialog */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Vérification de suppression</DialogTitle>
                <DialogDescription>
                  Pour confirmer la suppression définitive, nous devons vérifier votre identité
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {!codeSent ? (
                  <>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm">
                        Un code de vérification à 6 chiffres sera envoyé à votre email pour confirmer la suppression définitive de votre compte.
                      </p>
                    </div>
                    <Button
                      onClick={handleSendDeleteCode}
                      disabled={isSendingCode}
                      className="w-full"
                    >
                      {isSendingCode ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Envoi...
                        </>
                      ) : (
                        'Envoyer le code'
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="delete_code">Code de vérification</Label>
                      <Input
                        id="delete_code"
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Le code a été envoyé à votre email
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCodeSent(false);
                          setVerificationCode('');
                        }}
                        className="flex-1"
                      >
                        Renvoyer
                      </Button>
                      <Button
                        onClick={handleVerifyDeleteCode}
                        disabled={isVerifying}
                        variant="destructive"
                        className="flex-1 bg-red-600 hover:bg-red-700"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Suppression...
                          </>
                        ) : (
                          'Supprimer définitivement'
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Cancellation Confirmation Dialog */}
          <Dialog open={showCancelConfirmDialog} onOpenChange={setShowCancelConfirmDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer la résiliation</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir résilier votre abonnement VIP ?
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ Votre abonnement sera annulé mais vous garderez l'accès VIP jusqu'à la fin de la période payée.
                  </p>
                  {subscription?.expires_at && (
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                      Date d'expiration : {new Date(subscription.expires_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelConfirmDialog(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setShowCancelConfirmDialog(false);
                      setShowCancelDialog(true);
                    }}
                    className="flex-1"
                  >
                    Continuer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Cancellation Verification Dialog */}
          <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Vérification de résiliation</DialogTitle>
                <DialogDescription>
                  Pour confirmer la résiliation, nous devons vérifier votre identité
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {!codeSent ? (
                  <>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm">
                        Un code de vérification à 6 chiffres sera envoyé à votre email pour confirmer la résiliation.
                      </p>
                    </div>
                    <Button
                      onClick={handleSendCancelCode}
                      disabled={isSendingCode}
                      className="w-full"
                    >
                      {isSendingCode ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Envoi...
                        </>
                      ) : (
                        'Envoyer le code'
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cancel_code">Code de vérification</Label>
                      <Input
                        id="cancel_code"
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Le code a été envoyé à votre email
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCodeSent(false);
                          setVerificationCode('');
                        }}
                        className="flex-1"
                      >
                        Renvoyer
                      </Button>
                      <Button
                        onClick={handleVerifyCancelCode}
                        disabled={isVerifying}
                        variant="destructive"
                        className="flex-1"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Vérification...
                          </>
                        ) : (
                          'Confirmer la résiliation'
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Email Change Dialog */}
          <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier l'email</DialogTitle>
                <DialogDescription>
                  Un code de vérification sera envoyé à votre téléphone
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {!codeSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="new_email">Nouvel email</Label>
                      <Input
                        id="new_email"
                        type="email"
                        placeholder="nouveau@email.com"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleSendEmailCode}
                      disabled={isSendingCode}
                      className="w-full"
                    >
                      {isSendingCode ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Envoi...
                        </>
                      ) : (
                        'Envoyer le code'
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="code">Code de vérification</Label>
                      <Input
                        id="code"
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Le code a été envoyé à votre téléphone
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCodeSent(false);
                          setVerificationCode('');
                        }}
                        className="flex-1"
                      >
                        Renvoyer
                      </Button>
                      <Button
                        onClick={handleVerifyEmailCode}
                        disabled={isVerifying}
                        className="flex-1"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Vérification...
                          </>
                        ) : (
                          'Vérifier'
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Password Change Dialog */}
          <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le mot de passe</DialogTitle>
                <DialogDescription>
                  Un code de vérification sera envoyé à votre email
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {!codeSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="new_password">Nouveau mot de passe</Label>
                      <Input
                        id="new_password"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Minimum 6 caractères
                      </p>
                    </div>
                    <Button
                      onClick={handleSendPasswordCode}
                      disabled={isSendingCode}
                      className="w-full"
                    >
                      {isSendingCode ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Envoi...
                        </>
                      ) : (
                        'Envoyer le code'
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password_code">Code de vérification</Label>
                      <Input
                        id="password_code"
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Le code a été envoyé à votre email
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCodeSent(false);
                          setVerificationCode('');
                        }}
                        className="flex-1"
                      >
                        Renvoyer
                      </Button>
                      <Button
                        onClick={handleVerifyPasswordCode}
                        disabled={isVerifying}
                        className="flex-1"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Vérification...
                          </>
                        ) : (
                          'Vérifier'
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Phone Change Dialog */}
          <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le téléphone</DialogTitle>
                <DialogDescription>
                  Un code de vérification sera envoyé à votre email
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {!codeSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="new_phone">Nouveau numéro de téléphone</Label>
                      <Input
                        id="new_phone"
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Format: +33 6 12 34 56 78
                      </p>
                    </div>
                    <Button
                      onClick={handleSendPhoneCode}
                      disabled={isSendingCode}
                      className="w-full"
                    >
                      {isSendingCode ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Envoi...
                        </>
                      ) : (
                        'Envoyer le code'
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phone_code">Code de vérification</Label>
                      <Input
                        id="phone_code"
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Le code a été envoyé à votre email
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCodeSent(false);
                          setVerificationCode('');
                        }}
                        className="flex-1"
                      >
                        Renvoyer
                      </Button>
                      <Button
                        onClick={handleVerifyPhoneCode}
                        disabled={isVerifying}
                        className="flex-1"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Vérification...
                          </>
                        ) : (
                          'Vérifier'
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <NotificationSettings />
        </div>
      </main>
      {!isNativeApp && <Footer />}
    </div>
  );
};

export default Profile;
