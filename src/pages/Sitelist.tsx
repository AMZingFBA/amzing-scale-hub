import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Globe, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LinkItem {
  url: string;
  name: string;
  note?: string;
}

interface LinkCategory {
  title: string;
  emoji: string;
  links: LinkItem[];
}

const categories: LinkCategory[] = [
  {
    title: "Grossistes / Fournisseurs B2B",
    emoji: "🔹",
    links: [
      { url: "https://osma-werm.com/fr/", name: "Osma Werm" },
      { url: "https://www.eurolots.com/en", name: "Eurolots" },
      { url: "https://www.jono-toys.nl/", name: "Jono Toys" },
      { url: "https://merkandi.fr/", name: "Merkandi" },
      { url: "https://www.zentrada.com/fr/", name: "Zentrada" },
      { url: "https://www.jactal.com/fr_FR/", name: "Jactal" },
      { url: "https://laniustoys.com/en", name: "Lanius Toys" },
      { url: "https://simcha.fr/", name: "Simcha" },
      { url: "https://www.rowan.eu.com/", name: "Rowan" },
      { url: "https://yari.eu/", name: "Yari" },
    ]
  },
  {
    title: "Déstockage & ventes à prix réduits",
    emoji: "🔹",
    links: [
      { url: "https://www.espace-des-marques.com/fr/", name: "Espace des Marques" },
      { url: "https://lots.stocklear.fr/", name: "Stocklear" },
      { url: "https://www.showroomprive.com/", name: "Showroom Privé" },
      { url: "https://fr.ankorstore.com/", name: "Ankorstore" },
      { url: "https://www.veepee.fr/", name: "Veepee" },
    ]
  },
  {
    title: "Sites commerçants français & européens",
    emoji: "🔹",
    links: [
      { url: "https://www.monoprix.fr/loisirs.html", name: "Monoprix" },
      { url: "https://www.ikea.com/", name: "IKEA" },
      { url: "https://www.ravensburger.fr/fr-FR", name: "Ravensburger" },
      { url: "https://www.fnac.com/", name: "Fnac" },
      { url: "https://www.ludum.fr/", name: "Ludum" },
      { url: "https://www.auchan.fr/", name: "Auchan" },
      { url: "https://www.playmobil.com/", name: "Playmobil" },
      { url: "https://www.ibood.com/", name: "iBood" },
      { url: "https://www.e.leclerc/", name: "E.Leclerc" },
      { url: "https://www.carrefour.fr/", name: "Carrefour" },
      { url: "https://www.interdiscount.ch/fr/", name: "Interdiscount" },
      { url: "https://www.stokomani.fr/", name: "Stokomani" },
      { url: "https://www.smythstoys.com/", name: "Smyths Toys" },
      { url: "https://www.king-jouet.com/", name: "King Jouet" },
      { url: "https://www.alternate.fr/", name: "Alternate" },
      { url: "https://boutique.orange.fr/", name: "Orange" },
      { url: "https://www.juguetilandia.fr/", name: "Juguetilandia" },
    ]
  },
  {
    title: "Beauté / Hygiène / Parapharmacie",
    emoji: "🔹",
    links: [
      { url: "https://osma-werm.com/fr/", name: "Osma Werm" },
      { url: "https://www.notino.fr/", name: "Notino" },
      { url: "https://www.boticinal.com/", name: "Boticinal" },
      { url: "https://www.pharmashopdiscount.com/fr", name: "Pharma Shop Discount" },
      { url: "https://www.my-origines.com/fr", name: "My Origines" },
      { url: "https://www.parfumsetmoi.fr/", name: "Parfums et Moi" },
      { url: "https://www.kalista-parfums.com/fr/bons-plans", name: "Kalista Parfums" },
      { url: "https://fr.victoriassecret.com/fr/vs/beauty", name: "Victoria's Secret" },
      { url: "https://www.paratamtam.com/", name: "Paratamtam" },
      { url: "https://www.3ppharma.fr/", name: "3P Pharma" },
      { url: "https://www.parapromos.com/", name: "Parapromos" },
      { url: "https://www.docmorris.fr/", name: "DocMorris" },
      { url: "https://fr.iherb.com/", name: "iHerb" },
      { url: "https://www.easypara.fr/", name: "Easypara" },
      { url: "https://laboutiquemalik.com/", name: "La Boutique Malik" },
      { url: "https://www.miamland.com/", name: "Miamland" },
    ]
  },
  {
    title: "Jouets / Jeux",
    emoji: "🔹",
    links: [
      { url: "https://bricksdirect.fr/fr/", name: "Bricks Direct" },
      { url: "https://www.dinotoys.nl/fr/", name: "Dino Toys" },
      { url: "https://www.placedespop.com/", name: "Place des Pop", note: "–10 % avec le code PLACEDESPOP" },
      { url: "http://dreamland.be/", name: "Dreamland" },
    ]
  },
  {
    title: "Outillage & matériel",
    emoji: "🔹",
    links: [
      { url: "https://racetools.fr/", name: "Racetools" },
      { url: "https://www.guedo-outillage.fr/", name: "Guedo Outillage" },
      { url: "https://www.conrad.fr/", name: "Conrad" },
    ]
  },
  {
    title: "Alimentaire",
    emoji: "🔹",
    links: [
      { url: "https://www.asiamarche.fr/", name: "Asia Marché" },
      { url: "https://www.miamland.com/", name: "Miamland" },
    ]
  },
  {
    title: "Pokémon / Cartes & produits spécialisés",
    emoji: "🔹",
    links: [
      { url: "https://hikarudistribution.com/", name: "Hikaru Distribution" },
      { url: "https://www.dstrib.com/", name: "DStrib" },
    ]
  },
  {
    title: "Ventes aux enchères & plateformes entre particuliers",
    emoji: "🔹",
    links: [
      { url: "https://www.catawiki.com/fr/", name: "Catawiki" },
      { url: "https://www.interencheres.com/", name: "Interenchères" },
      { url: "https://www.moniteurdesventes.com/fr/", name: "Moniteur des Ventes" },
      { url: "https://www.ebay.fr/", name: "eBay" },
      { url: "https://www.leboncoin.fr/", name: "Leboncoin" },
      { url: "https://www.vinted.fr/", name: "Vinted" },
      { url: "https://www.beebs.app/", name: "Beebs" },
    ]
  },
  {
    title: "Autres plateformes utiles",
    emoji: "🌍",
    links: [
      { url: "https://www.yesstyle.com/fr/home.html", name: "YesStyle" },
    ]
  },
];

const keywords = [
  "Wholesale",
  "Supplier / Suppliers",
  "Grossiste",
  "Fournisseur",
  "Distributeur / Distributor",
  "B2B",
  "Hurtownia Zabawek (grossiste jouets – polonais)",
  "Mayorista (grossiste – espagnol)",
];

const Sitelist = () => {
  const { user, isVIP, isLoading: isAuthLoading } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user && !isAuthLoading) {
      navigate('/auth');
      return;
    }

    if (isAuthLoading || isAdminLoading) return;

    if (!isVIP && !isAdmin) {
      toast({
        title: "Accès VIP requis",
        description: "Cette section est réservée aux membres VIP",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [user, isVIP, isAdmin, isAuthLoading, isAdminLoading, navigate, toast]);

  if (isAuthLoading || isAdminLoading) {
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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#FF9900] hover:bg-[#FF9900]/90 p-3 md:p-2 rounded-full shadow-lg transition-all shrink-0"
              aria-label="Retour au dashboard"
            >
              <ArrowLeft className="w-6 h-6 md:w-5 md:h-5 text-white" />
            </button>
            <Globe className="w-8 h-8 text-primary" />
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold">Sitelist</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Sources d'approvisionnement & opportunités
              </p>
            </div>
          </div>

          {/* Introduction */}
          <Card className="mb-8 border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <p className="text-base leading-relaxed">
                Cette sélection regroupe des grossistes, plateformes B2B, sites de déstockage et enseignes reconnues, 
                utiles pour identifier des opportunités produits et diversifier vos sources d'approvisionnement.
              </p>
            </CardContent>
          </Card>

          {/* Categories */}
          <div className="space-y-6">
            {categories.map((category, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span>{category.emoji}</span>
                    <span>{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {category.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <ExternalLink className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="font-medium flex-1">{link.name}</span>
                        {link.note && (
                          <span className="text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded">
                            {link.note}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Keywords section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span>🔍</span>
                <span>Mots-clés recommandés pour vos recherches</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                À utiliser sur Google et les plateformes B2B :
              </p>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-primary/10 text-primary rounded-lg font-medium text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sitelist;
