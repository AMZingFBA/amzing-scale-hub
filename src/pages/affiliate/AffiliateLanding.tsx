import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, Euro, Gift } from "lucide-react";

const AffiliateLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Programme d'affiliation AMZing FBA
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Gagnez des revenus en recommandant AMZing FBA à votre réseau
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/affiliate/signup")}>
              S'inscrire
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/affiliate/login")}>
              Se connecter
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Users className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Parrainez facilement</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Obtenez votre lien unique et partagez-le avec votre réseau
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Suivez vos gains</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Dashboard complet pour suivre tous vos filleuls et commissions
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Euro className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Paiements mensuels</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Recevez vos commissions chaque mois directement sur votre compte
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Gift className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Commissions attractives</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gagnez pour chaque nouvel abonné que vous parrainez
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Comment ça marche ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Inscrivez-vous gratuitement</h3>
                  <p className="text-muted-foreground">
                    Créez votre compte affilié en quelques minutes
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Obtenez votre lien unique</h3>
                  <p className="text-muted-foreground">
                    Recevez instantanément votre lien de parrainage personnalisé
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Partagez et gagnez</h3>
                  <p className="text-muted-foreground">
                    Partagez votre lien et gagnez pour chaque inscription
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AffiliateLanding;
