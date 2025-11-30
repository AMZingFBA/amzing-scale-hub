import { Mail, Clock, Trash2, Database } from "lucide-react";

const SuppressionCompte = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-card border border-border rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Suppression de Compte – AMZing FBA
        </h1>
        
        <p className="text-foreground/80 mb-6 leading-relaxed">
          Si vous souhaitez supprimer votre compte AMZing FBA ainsi que toutes les données associées 
          (email, préférences, abonnements, historique), veuillez nous contacter à l'adresse suivante :
        </p>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 flex items-center gap-3">
          <Mail className="w-5 h-5 text-primary" />
          <a 
            href="mailto:contact@amzingfba.com" 
            className="text-primary font-semibold hover:underline"
          >
            contact@amzingfba.com
          </a>
        </div>

        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold text-foreground">Indiquez :</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-2">
            <li>l'adresse email utilisée pour votre compte</li>
            <li>la confirmation que vous souhaitez supprimer définitivement votre compte</li>
          </ul>
        </div>

        <div className="space-y-4 border-t border-border pt-6">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-foreground/60 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Délai de traitement :</p>
              <p className="text-foreground/80">48 à 72 heures</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Trash2 className="w-5 h-5 text-foreground/60 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Données supprimées :</p>
              <p className="text-foreground/80">email, profil, préférences</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-foreground/60 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Données conservées :</p>
              <p className="text-foreground/80">factures Stripe (obligation légale)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppressionCompte;
