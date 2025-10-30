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
import { ArrowLeft, User, Mail, Phone, Edit2, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    nickname: '',
    phone: '',
    avatar_url: '',
    email: '',
  });
  const isNativeApp = Capacitor.isNativePlatform();

  useEffect(() => {
    if (!user && !isAuthLoading) {
      navigate('/auth');
      return;
    }

    if (user) {
      loadProfile();
    }
  }, [user, isAuthLoading, navigate]);

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
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  L'email ne peut pas être modifié
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
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={profileData.phone || ''}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                />
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
        </div>
      </main>
      {!isNativeApp && <Footer />}
    </div>
  );
};

export default Profile;
