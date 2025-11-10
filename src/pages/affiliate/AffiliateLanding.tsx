import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, Euro, Gift, Award, Zap, CheckCircle, AlertCircle } from "lucide-react";

const AffiliateLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Programme d'affiliation AMZing FBA
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Gagnez des revenus en recommandant AMZing FBA à votre réseau
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/affiliate/signup")} className="hover-scale">
              S'inscrire
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/affiliate/login")} className="hover-scale">
              Se connecter
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="hover-scale transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <Users className="h-12 w-12 mb-4 text-primary transition-transform duration-300 hover:scale-110" />
              <CardTitle>Parrainez facilement</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Obtenez votre lien unique et partagez-le avec votre réseau
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <TrendingUp className="h-12 w-12 mb-4 text-primary transition-transform duration-300 hover:scale-110" />
              <CardTitle>Suivez vos gains</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Dashboard complet pour suivre tous vos filleuls et commissions
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <Euro className="h-12 w-12 mb-4 text-primary transition-transform duration-300 hover:scale-110" />
              <CardTitle>Paiements mensuels</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Recevez vos commissions chaque mois directement sur votre compte
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <Gift className="h-12 w-12 mb-4 text-primary transition-transform duration-300 hover:scale-110" />
              <CardTitle>Commissions attractives</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gagnez pour chaque nouvel abonné que vous parrainez
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Card className="hover-scale transition-all duration-300 hover:shadow-lg">
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

        <div className="max-w-5xl mx-auto mb-16">
          <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Zap className="h-16 w-16 mx-auto mb-4 text-primary animate-pulse" />
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              🚀 Programme de parrainage AMZing FBA
            </h2>
            <p className="text-lg text-muted-foreground">
              Recommande l'application et gagne de l'argent chaque mois grâce à ton lien de parrainage
            </p>
          </div>

          <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover-scale transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-primary transition-transform duration-300 hover:scale-110" />
                <div>
                  <CardTitle className="text-2xl">Abonnement : 34,99 € / mois</CardTitle>
                  <CardDescription className="text-base mt-1">
                    1 seul niveau de parrainage – simple, transparent et 100 % automatique
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="mb-8 hover-scale transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Euro className="h-6 w-6 text-primary transition-transform duration-300 hover:scale-110" />
                Barème de commission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Niveau</TableHead>
                      <TableHead className="font-bold">Qui c'est ?</TableHead>
                      <TableHead className="font-bold">Pourcentage</TableHead>
                      <TableHead className="font-bold">Combien tu gagnes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-primary/5">
                      <TableCell className="font-bold">🥇 Parrain direct</TableCell>
                      <TableCell>La personne qui s'abonne via ton lien</TableCell>
                      <TableCell>
                        <span className="font-bold text-primary">20%</span> sur l'abonnement (34,99 €)
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-primary text-lg">6,99 € / mois</span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-primary/20">
                <p className="text-sm font-medium flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    👉 Tant que ton filleul reste abonné, tu touches <strong className="text-primary">6,99 €</strong> chaque mois, automatiquement.<br />
                    💸 Le paiement est effectué à la fin du mois du filleul, après la validation de son abonnement.
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 hover-scale transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary transition-transform duration-300 hover:scale-110" />
                📊 Exemple concret
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Nombre de filleuls</TableHead>
                      <TableHead className="font-bold text-right">Revenu mensuel total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>1 filleul</TableCell>
                      <TableCell className="text-right font-semibold">6,99 €</TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/30">
                      <TableCell>5 filleuls</TableCell>
                      <TableCell className="text-right font-semibold">34,95 €</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>10 filleuls</TableCell>
                      <TableCell className="text-right font-semibold text-primary">69,90 €</TableCell>
                    </TableRow>
                    <TableRow className="bg-primary/10">
                      <TableCell className="font-bold">20 filleuls</TableCell>
                      <TableCell className="text-right font-bold text-primary text-lg">139,80 €</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="mt-6 space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Tu peux parrainer autant de personnes que tu veux
                </p>
                <p className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Chaque abonnement actif te rapporte chaque mois sans limite de durée
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 hover-scale transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: '1s' }}>
            <CardHeader>
              <CardTitle className="text-2xl">🧾 Fonctionnement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Calcul des commissions</p>
                  <p className="text-sm text-muted-foreground">
                    Les commissions sont calculées à la fin de chaque mois, après la validation du paiement du filleul
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Méthode de paiement</p>
                  <p className="text-sm text-muted-foreground">
                    Le paiement est envoyé par virement bancaire (RIB demandé à l'inscription)
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Seuil minimum</p>
                  <p className="text-sm text-muted-foreground">
                    Le seuil minimum de paiement est fixé à <strong className="text-primary">50 € cumulés</strong>
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Suivi en temps réel</p>
                  <p className="text-sm text-muted-foreground">
                    Depuis ton espace affilié, tu peux suivre la liste de tes filleuls, leurs dates d'inscription et tes gains mensuels en temps réel
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/30 bg-primary/5 hover-scale transition-all duration-300 hover:shadow-xl animate-fade-in" style={{ animationDelay: '1.1s' }}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1 animate-pulse" />
                <div>
                  <CardTitle className="text-xl">Important</CardTitle>
                  <CardDescription className="mt-3 text-foreground/80 space-y-2">
                    <p>
                      Le programme AMZing FBA est un système d'affiliation à <strong>un seul niveau</strong>.
                    </p>
                    <p>
                      Les commissions sont versées uniquement sur les abonnements <strong>réellement payés et validés</strong>.
                    </p>
                    <p className="font-medium">
                      Ce modèle garantit une structure simple, durable et <strong className="text-primary">100 % conforme à la loi</strong>.
                    </p>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <Button size="lg" onClick={() => navigate("/affiliate/signup")} className="text-lg px-8 py-6 hover-scale hover:shadow-xl transition-all duration-300">
              Rejoindre le programme maintenant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateLanding;
