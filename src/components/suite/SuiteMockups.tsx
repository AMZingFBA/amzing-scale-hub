import suiteMockups from '@/assets/suite-mockups.jpg';

const SuiteMockups = () => {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-suite-blue/5 to-transparent" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Une plateforme <span className="text-suite-orange">complète</span> et intuitive
          </h2>
          <p className="text-suite-gray text-lg max-w-2xl mx-auto">
            Accède à tous tes outils depuis n'importe quel appareil : ordinateur, tablette ou smartphone.
          </p>
        </div>

        {/* Mockups image */}
        <div className="relative flex justify-center">
          <div className="relative max-w-4xl w-full">
            <img 
              src={suiteMockups} 
              alt="AMZing FBA - Plateforme accessible sur tous les appareils" 
              className="w-full h-auto rounded-2xl"
            />
            
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-suite-orange/10 blur-3xl -z-10 scale-110 opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuiteMockups;
