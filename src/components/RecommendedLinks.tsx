import { getRecommendedLinks, internalLinks } from "@/lib/internal-links";
import InternalLink from "./InternalLink";

interface RecommendedLinksProps {
  page: keyof typeof internalLinks;
  title?: string;
  className?: string;
}

/**
 * Composant affichant les liens internes recommandés pour une page
 * Améliore le maillage interne et le SEO
 */
const RecommendedLinks = ({ 
  page, 
  title = "Pour aller plus loin", 
  className = "" 
}: RecommendedLinksProps) => {
  const links = getRecommendedLinks(page);

  if (links.length === 0) return null;

  return (
    <nav 
      className={`border-t border-border pt-8 mt-12 ${className}`}
      aria-label="Navigation vers pages connexes"
    >
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {links.map((link, index) => (
          <div 
            key={index}
            className="flex flex-col gap-2 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
          >
            <InternalLink
              text={link.text}
              url={link.url}
              context={link.context}
              className="text-lg"
            />
            {link.context && (
              <p className="text-sm text-muted-foreground">{link.context}</p>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default RecommendedLinks;
