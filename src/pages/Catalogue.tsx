import { Package, TrendingUp, Tag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Catalogue = () => {
  // Example products - to be replaced with real data
  const products = [
    {
      id: 1,
      name: "PLACEHOLDER - Produit Exemple 1",
      category: "Électronique",
      prixGros: "12.50€",
      prixVente: "39.90€",
      roi: "219%",
      stock: "En stock",
      moq: "50 unités",
    },
    {
      id: 2,
      name: "PLACEHOLDER - Produit Exemple 2",
      category: "Maison & Jardin",
      prixGros: "8.20€",
      prixVente: "29.90€",
      roi: "265%",
      stock: "En stock",
      moq: "100 unités",
    },
    {
      id: 3,
      name: "PLACEHOLDER - Produit Exemple 3",
      category: "Sport & Fitness",
      prixGros: "15.80€",
      prixVente: "49.90€",
      roi: "216%",
      stock: "Stock limité",
      moq: "30 unités",
    },
    {
      id: 4,
      name: "PLACEHOLDER - Produit Exemple 4",
      category: "Beauté & Santé",
      prixGros: "6.50€",
      prixVente: "24.90€",
      roi: "283%",
      stock: "En stock",
      moq: "200 unités",
    },
    {
      id: 5,
      name: "PLACEHOLDER - Produit Exemple 5",
      category: "Accessoires",
      prixGros: "4.20€",
      prixVente: "19.90€",
      roi: "374%",
      stock: "En stock",
      moq: "500 unités",
    },
    {
      id: 6,
      name: "PLACEHOLDER - Produit Exemple 6",
      category: "Cuisine",
      prixGros: "11.30€",
      prixVente: "34.90€",
      roi: "209%",
      stock: "Précommande",
      moq: "75 unités",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Catalogue mis à jour chaque semaine
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Catalogue Produits Rentables
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Produits sourcés, testés et validés. Prix gros, ROI estimé et disponibilité en temps réel.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <Card>
              <CardContent className="pt-6 text-center">
                <Package className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Produits Vérifiés</h3>
                <p className="text-sm text-muted-foreground">Sourcés et testés</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-10 h-10 text-secondary mx-auto mb-3" />
                <h3 className="font-bold mb-2">ROI Transparent</h3>
                <p className="text-sm text-muted-foreground">Estimations réalistes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Tag className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Prix Compétitifs</h3>
                <p className="text-sm text-muted-foreground">Tarifs gros</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <ShoppingCart className="w-10 h-10 text-secondary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Commande Simple</h3>
                <p className="text-sm text-muted-foreground">Process fluide</p>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Produits Disponibles</h2>
              <Badge variant="outline" className="text-muted-foreground">
                {products.length} produits
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{product.category}</Badge>
                      <Badge 
                        className={
                          product.stock === "En stock" 
                            ? "bg-green-500/10 text-green-600 border-green-500/20" 
                            : product.stock === "Stock limité"
                            ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        }
                      >
                        {product.stock}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Prix gros</span>
                        <span className="font-bold text-lg">{product.prixGros}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Prix vente estimé</span>
                        <span className="font-semibold">{product.prixVente}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                        <span className="text-sm font-semibold">ROI estimé</span>
                        <span className="font-bold text-gradient text-xl">{product.roi}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">MOQ</span>
                        <span className="font-medium">{product.moq}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="hero" className="flex-1">
                      Commander
                    </Button>
                    <Button variant="outline">
                      Détails
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Note */}
          <Card className="mt-12 border-2 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                <strong>Note importante :</strong> Les produits affichés sont des exemples. 
                Le catalogue réel est accessible aux membres après inscription. 
                Les estimations de ROI sont basées sur des données de marché et peuvent varier.
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="mt-12 bg-gradient-to-r from-primary to-secondary text-white border-none">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Accès Complet au Catalogue
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Rejoignez AMZing FBA pour accéder à l'ensemble du catalogue mis à jour chaque semaine
              </p>
              <Button variant="secondary" size="xl" className="bg-white text-primary hover:bg-white/90">
                Rejoindre maintenant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Catalogue;
