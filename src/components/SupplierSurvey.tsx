import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Leaf, Package, Euro, Truck, ShoppingCart, Percent, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SupplierSurvey = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedResponse, setSelectedResponse] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);
  const [userResponse, setUserResponse] = useState<string>('');
  const [stats, setStats] = useState<{ response: string; count: number }[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);

  useEffect(() => {
    if (user) {
      checkExistingResponse();
      loadStats();
    }
  }, [user]);

  const checkExistingResponse = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('supplier_survey_responses' as any)
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setHasResponded(true);
        setUserResponse((data as any).response);
      }
    } catch (error) {
      // No response yet, that's fine
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('supplier_survey_responses' as any)
        .select('response');

      if (data && !error) {
        const counts: Record<string, number> = {};
        (data as any[]).forEach((item: { response: string }) => {
          counts[item.response] = (counts[item.response] || 0) + 1;
        });
        
        const statsArray = Object.entries(counts).map(([response, count]) => ({
          response,
          count
        }));
        
        setStats(statsArray);
        setTotalResponses((data as any[]).length);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSubmit = async () => {
    if (!user || !selectedResponse) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('supplier_survey_responses' as any)
        .insert({
          user_id: user.id,
          response: selectedResponse
        } as any);

      if (error) throw error;

      setHasResponded(true);
      setUserResponse(selectedResponse);
      loadStats();
      
      toast({
        title: "Merci pour votre réponse ! 🙏",
        description: "Votre avis a bien été enregistré.",
      });
    } catch (error) {
      console.error('Error submitting response:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre réponse",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResponseLabel = (response: string) => {
    switch (response) {
      case 'tres_interesse': return '🔥 Très intéressé';
      case 'a_voir': return '🤔 Pourquoi pas, à voir';
      case 'non': return '❌ Non, pas intéressé';
      default: return response;
    }
  };

  const getResponseColor = (response: string) => {
    switch (response) {
      case 'tres_interesse': return 'bg-green-500';
      case 'a_voir': return 'bg-amber-500';
      case 'non': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPercentage = (response: string) => {
    const stat = stats.find(s => s.response === response);
    if (!stat || totalResponses === 0) return 0;
    return Math.round((stat.count / totalResponses) * 100);
  };

  return (
    <Card className="border-2 border-green-500/50 bg-gradient-to-br from-green-500/5 to-emerald-500/5 mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-green-500 text-white">
            <Leaf className="w-3 h-3 mr-1" />
            Nouveau Fournisseur
          </Badge>
          <Badge variant="outline" className="border-green-500 text-green-600">
            Sondage
          </Badge>
        </div>
        <CardTitle className="text-xl md:text-2xl">
          🌿 Nouveau Grossiste : Compléments Alimentaires Bio
        </CardTitle>
        <CardDescription className="text-base">
          Êtes-vous intéressé par l'ajout de ce fournisseur dans notre catalogue ?
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Supplier Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-background/50 rounded-lg border">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-green-500/10">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Spécialisation</p>
              <p className="text-sm text-muted-foreground">Compléments alimentaires 100% BIO</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-blue-500/10">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">25 ans d'expérience</p>
              <p className="text-sm text-muted-foreground">Produits 100% français</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-purple-500/10">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">+200 produits disponibles</p>
              <p className="text-sm text-muted-foreground">Déjà en vente sur Amazon</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-amber-500/10">
              <Euro className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium">Prix moyens : 15€ - 35€ TTC</p>
              <p className="text-sm text-muted-foreground">Commande minimum : 100€</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-green-500/10">
              <Percent className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">ROI Net : 40% à 50%</p>
              <p className="text-sm text-muted-foreground">Codes EAN disponibles</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-cyan-500/10">
              <Truck className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="font-medium">Livraison : 2 jours ouvrés</p>
              <p className="text-sm text-muted-foreground">Marketing simple requis</p>
            </div>
          </div>
        </div>

        {/* Survey Form or Results */}
        {hasResponded ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Votre réponse : {getResponseLabel(userResponse)}</span>
            </div>
            
            {totalResponses > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground font-medium">
                  Résultats actuels ({totalResponses} réponse{totalResponses > 1 ? 's' : ''}) :
                </p>
                <div className="space-y-2">
                  {['tres_interesse', 'a_voir', 'non'].map((response) => (
                    <div key={response} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{getResponseLabel(response)}</span>
                        <span className="font-medium">{getPercentage(response)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getResponseColor(response)} transition-all duration-500`}
                          style={{ width: `${getPercentage(response)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <RadioGroup value={selectedResponse} onValueChange={setSelectedResponse}>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                <RadioGroupItem value="tres_interesse" id="tres_interesse" />
                <Label htmlFor="tres_interesse" className="flex-1 cursor-pointer font-medium">
                  🔥 Très intéressé, je veux accéder à ce fournisseur !
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                <RadioGroupItem value="a_voir" id="a_voir" />
                <Label htmlFor="a_voir" className="flex-1 cursor-pointer font-medium">
                  🤔 Pourquoi pas, à voir selon les produits exacts
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                <RadioGroupItem value="non" id="non" />
                <Label htmlFor="non" className="flex-1 cursor-pointer font-medium">
                  ❌ Non, ça ne m'intéresse pas
                </Label>
              </div>
            </RadioGroup>
            
            <Button 
              onClick={handleSubmit}
              disabled={!selectedResponse || isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma réponse'}
            </Button>
          </div>
        )}

        <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Votre avis nous aide à sélectionner les meilleurs fournisseurs pour la communauté. 
            Si l'intérêt est suffisant, nous ajouterons ce fournisseur au catalogue.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierSurvey;
