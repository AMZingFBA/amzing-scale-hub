// Images du blog - imports centralisés
import guideFbaHero from '@/assets/blog/guide-fba-hero.jpg';
import produitsRentablesHero from '@/assets/blog/produits-rentables-hero.jpg';
import logistiqueFbaHero from '@/assets/blog/logistique-fba-hero.jpg';
import vendreAmazonHero from '@/assets/blog/vendre-amazon-hero.jpg';
import fbaVsFbmHero from '@/assets/blog/fba-vs-fbm-hero.jpg';
import coutsFbaHero from '@/assets/blog/couts-fba-hero.jpg';

export const blogImages = {
  guideFba: guideFbaHero,
  produitsRentables: produitsRentablesHero,
  logistique: logistiqueFbaHero,
  vendreAmazon: vendreAmazonHero,
  fbaVsFbm: fbaVsFbmHero,
  coutsFba: coutsFbaHero,
} as const;

export type BlogImageKey = keyof typeof blogImages;
