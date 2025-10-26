import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid session for password reset
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidSession(true);
      } else {
        toast.error('Session invalide ou expirée');
        navigate('/auth');
      }
    });
  }, [navigate]);

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast.success('Mot de passe mis à jour avec succès !');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour du mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidSession) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/auth" className="flex items-center justify-center mb-8">
          <img src={logo} alt="AMZing FBA" className="w-full max-w-md" />
        </Link>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Nouveau mot de passe</CardTitle>
            <CardDescription className="text-center">
              Choisissez un nouveau mot de passe sécurisé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                variant="hero"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2">
                <ArrowLeft size={16} />
                Retour à la connexion
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
