import { Check, Infinity, Headphones, Users, Calendar, RefreshCcw } from 'lucide-react';

const SuiteWhatYouGet = () => {
  const mainFeatures = [
    "Produits rentables envoyés chaque semaine",
    "ROI et marges calculés pour chaque produit",
    "Catalogue fournisseurs et deals exclusifs",
    "Templates listings Amazon optimisés",
    "Calculateurs de coûts et marges",
    "Checklists produit et lancement",
    "Forma en ligne : modules et guides pas à pas",
    "Process complets pour chaque étape FBA",
    "Mises à jour et nouveaux produits inclus"
  ];

  const includedItems = [
    { icon: Infinity, text: "Accès logiciel à vie" },
    { icon: Users, text: "Communauté privée" },
    { icon: Headphones, text: "Support 9h–19h" },
    { icon: Calendar, text: "Appel hebdo (30-60 min)" },
    { icon: RefreshCcw, text: "Mises à jour incluses" }
  ];

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ce que tu obtiens
          </h2>
          <p className="text-suite-gray text-lg">
            Tout inclus, accès illimité.
          </p>
        </div>

        <div className="bg-gradient-to-br from-suite-card to-suite-bg border border-suite-orange/30 rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-suite-orange/20 to-suite-blue/20 p-6 md:p-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-suite-orange flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AMZing FBA — Accès Complet</h3>
                <p className="text-suite-gray text-sm">Produits rentables + outils + accompagnement</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 lg:p-10">
            {/* Main features list */}
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {mainFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-suite-orange/20 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-suite-orange" />
                  </div>
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>

            {/* Included items */}
            <div className="bg-white/5 rounded-2xl p-6 md:p-8">
              <h4 className="text-lg font-semibold text-white mb-6 text-center">Inclus dans ton accès :</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {includedItems.map((item, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-suite-orange/10 flex items-center justify-center mb-3">
                      <item.icon className="w-6 h-6 text-suite-orange" />
                    </div>
                    <span className="text-sm text-suite-gray">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuiteWhatYouGet;
