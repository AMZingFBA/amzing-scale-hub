import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

export default function TestPushNotifications() {
  const [title, setTitle] = useState("Test de notification push");
  const [loading, setLoading] = useState(false);

  const sendTestNotification = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'ID de l'utilisateur admin
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      // Créer une alerte de test
      const { data: alert, error: alertError } = await supabase
        .from('admin_alerts')
        .insert({
          admin_id: userData.user.id,
          title: title,
          content: 'Notification de test envoyée depuis la page de test',
          category: 'notifications',
          subcategory: null
        })
        .select()
        .single();

      if (alertError) throw alertError;

      console.log('Test alert created:', alert);

      // Envoyer la notification push via l'edge function
      const { data, error } = await supabase.functions.invoke('send-push-notifications', {
        body: {
          alert_id: alert.id,
          title: title,
          category: 'notifications',
        }
      });

      if (error) throw error;

      console.log('Notification sent:', data);
      
      toast.success(`✅ Notification envoyée!`, {
        description: `${data.sent}/${data.total} notifications envoyées avec succès`
      });
      
    } catch (error: any) {
      console.error('Error sending test notification:', error);
      toast.error("❌ Erreur lors de l'envoi", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="container max-w-2xl mx-auto pt-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">🔔 Test Push Notifications</CardTitle>
            <CardDescription>
              Envoyez une notification push de test à tous les utilisateurs VIP avec les notifications activées
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Message de la notification</Label>
              <Input
                id="title"
                placeholder="Entrez le message..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <Button 
              onClick={sendTestNotification} 
              disabled={loading || !title}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer la notification de test
                </>
              )}
            </Button>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">ℹ️ Comment ça fonctionne:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Seuls les utilisateurs VIP reçoivent les notifications</li>
                <li>• Les utilisateurs doivent avoir activé les notifications dans leurs paramètres</li>
                <li>• L'app doit être installée et les notifications autorisées sur l'appareil</li>
                <li>• Vérifiez les logs de l'edge function pour le debug</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">📱 Pour tester sur votre iPhone:</p>
              <ol className="text-sm space-y-1 text-muted-foreground">
                <li>1. Assurez-vous que l'app est lancée et les notifications autorisées</li>
                <li>2. Cliquez sur le bouton ci-dessus</li>
                <li>3. Vous devriez recevoir la notification dans quelques secondes</li>
                <li>4. Vérifiez aussi l'onglet Actualité dans l'app</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
