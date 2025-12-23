import SEO from '@/components/SEO';

const Partenaires = () => {
  return (
    <>
      <SEO 
        title="Partenaires | AMZing FBA"
        description="Nos partenaires de confiance"
        robots="noindex,follow"
      />
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-semibold text-foreground">Nos Partenaires</h1>
          <p className="text-muted-foreground">
            Découvrez nos partenaires de confiance dans le domaine de la formation.
          </p>
          <div className="pt-4">
            <a 
              href="https://www.formationmax.com" 
              target="_blank" 
              rel="noopener nofollow sponsored"
              className="text-primary hover:underline"
            >
              FormationMax.com - Annuaire de formations
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Partenaires;
