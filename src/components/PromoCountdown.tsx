import { Link } from 'react-router-dom';
import { Clock, Zap, PhoneCall, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PromoCountdown = () => {
  return (
    <div className="mt-8 relative">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl -z-10" />

      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary/30 rounded-2xl p-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-primary animate-pulse" />
          <Badge className="bg-primary text-primary-foreground border-0 text-sm px-3 py-1">
            Places d'accompagnement limitées
          </Badge>
          <Zap className="w-5 h-5 text-primary animate-pulse" />
        </div>

        {/* Text */}
        <div className="text-center mb-6 space-y-2">
          <p className="text-lg sm:text-xl font-bold text-foreground">
            Un tarif sur mesure, défini avec vous
          </p>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            <Users className="w-4 h-4 text-primary" />
            Pour garantir un accompagnement de qualité, nous limitons le nombre de nouveaux membres chaque mois
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Button asChild size="lg" className="font-semibold">
            <Link to="/demander-rappel">
              <PhoneCall className="w-4 h-4 mr-2" />
              Demander un rappel
            </Link>
          </Button>
        </div>

        {/* Urgency text */}
        <p className="text-center mt-4 text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Appel de diagnostic gratuit • <span className="font-semibold text-foreground">Réservez votre créneau rapidement</span>
        </p>
      </div>
    </div>
  );
};

export default PromoCountdown;
