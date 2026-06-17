import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, X, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Barre CTA collante en bas d'écran sur mobile uniquement.
 * Design premium pour justifier 700€.
 */
const BlogStickyMobileCTA = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 shadow-2xl border-t border-border/60">
      {/* En-tête compact */}
      <div className="bg-gradient-to-r from-foreground via-foreground/95 to-muted-foreground px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {[1,2,3].map(i => (
              <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 border border-foreground flex items-center justify-center text-[8px] font-bold text-primary-foreground">
                {String.fromCharCode(64+i)}
              </div>
            ))}
          </div>
          <span className="text-[10px] text-primary-foreground/80 font-medium">+500 formés</span>
        </div>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className="w-3 h-3 fill-primary text-primary" />
          ))}
          <span className="text-[10px] text-primary-foreground/80 ml-1 font-semibold">4.9</span>
        </div>
      </div>

      {/* Corps CTA */}
      <div className="p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] bg-background/95 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="text-xs font-bold text-foreground leading-tight mb-0.5">
              Formation Amazon FBA
            </div>
            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Shield className="w-3 h-3 text-primary" />
              Garantie 30j · 700€ · Accès immédiat
            </div>
          </div>
          <Button asChild size="sm" className="font-bold shadow-lg shrink-0 px-4">
            <Link to="/auth?tab=signup">
              <Zap className="w-4 h-4 mr-1.5" />
              Rejoindre
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Fermer"
            className="p-2 rounded-md text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogStickyMobileCTA;
