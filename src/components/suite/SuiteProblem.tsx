import { X, AlertTriangle } from 'lucide-react';

const SuiteProblem = () => {
  const problems = [
    "Trop d'infos, trop d'outils séparés partout",
    "Sourcing au hasard sans méthode claire",
    "Pas de process structuré pour avancer",
    "Isolement et pas de support quand tu bloques"
  ];

  return (
    <section className="py-20 lg:py-28 relative bg-gradient-to-b from-transparent via-red-950/10 to-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400 font-medium">Le problème</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tu te reconnais ?
          </h2>
          <p className="text-suite-gray text-lg max-w-2xl mx-auto">
            La plupart des vendeurs Amazon galèrent avec les mêmes obstacles...
          </p>
        </div>

        <div className="bg-suite-card border border-red-500/20 rounded-2xl p-8 md:p-10">
          <ul className="space-y-5">
            {problems.map((problem, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-lg text-suite-gray pt-1">{problem}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SuiteProblem;
