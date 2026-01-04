// Images du blog - imports centralisés
import guideFbaHero from '@/assets/blog/guide-fba-hero.jpg';
import produitsRentablesHero from '@/assets/blog/produits-rentables-hero.jpg';
import logistiqueFbaHero from '@/assets/blog/logistique-fba-hero.jpg';
import vendreAmazonHero from '@/assets/blog/vendre-amazon-hero.jpg';
import fbaVsFbmHero from '@/assets/blog/fba-vs-fbm-hero.jpg';
import coutsFbaHero from '@/assets/blog/couts-fba-hero.jpg';
import categoriesRentablesHero from '@/assets/blog/categories-rentables-hero.jpg';
import creerCompteVendeurHero from '@/assets/blog/creer-compte-vendeur-hero.jpg';
import preparerEnvoiFbaHero from '@/assets/blog/preparer-envoi-fba-hero.jpg';
import wholesaleAmazonHero from '@/assets/blog/wholesale-amazon-hero.jpg';
import outilsSourcingHero from '@/assets/blog/outils-sourcing-hero.jpg';
import privateLabelHero from '@/assets/blog/private-label-hero.jpg';
import gererRetoursHero from '@/assets/blog/gerer-retours-hero.jpg';
import vendreEuropeHero from '@/assets/blog/vendre-europe-hero.jpg';
import optimiserListingHero from '@/assets/blog/optimiser-listing-hero.jpg';
import amazonPpcHero from '@/assets/blog/amazon-ppc-hero.jpg';
import statutJuridiqueHero from '@/assets/blog/statut-juridique-hero.jpg';
import keepaAnalyseHero from '@/assets/blog/keepa-analyse-hero.jpg';
import ventesQ4Hero from '@/assets/blog/ventes-q4-hero.jpg';

export const blogImages = {
  guideFba: guideFbaHero,
  produitsRentables: produitsRentablesHero,
  logistique: logistiqueFbaHero,
  vendreAmazon: vendreAmazonHero,
  fbaVsFbm: fbaVsFbmHero,
  coutsFba: coutsFbaHero,
  categoriesRentables: categoriesRentablesHero,
  creerCompteVendeur: creerCompteVendeurHero,
  preparerEnvoiFba: preparerEnvoiFbaHero,
  wholesaleAmazon: wholesaleAmazonHero,
  outilsSourcing: outilsSourcingHero,
  privateLabel: privateLabelHero,
  gererRetours: gererRetoursHero,
  vendreEurope: vendreEuropeHero,
  optimiserListing: optimiserListingHero,
  amazonPpc: amazonPpcHero,
  statutJuridique: statutJuridiqueHero,
  keepaAnalyse: keepaAnalyseHero,
  ventesQ4: ventesQ4Hero,
} as const;

export type BlogImageKey = keyof typeof blogImages;
