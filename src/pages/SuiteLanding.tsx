import { useEffect } from 'react';
import SuiteHero from '@/components/suite/SuiteHero';
import SuiteForWho from '@/components/suite/SuiteForWho';
import SuiteProblem from '@/components/suite/SuiteProblem';
import SuiteSolution from '@/components/suite/SuiteSolution';
import SuiteHowItWorks from '@/components/suite/SuiteHowItWorks';
import SuiteWhatYouGet from '@/components/suite/SuiteWhatYouGet';
import SuiteDemo from '@/components/suite/SuiteDemo';
import SuiteDashboard from '@/components/suite/SuiteDashboard';
import SuiteTestimonials from '@/components/suite/SuiteTestimonials';
import SuitePricing from '@/components/suite/SuitePricing';
import SuiteFAQ from '@/components/suite/SuiteFAQ';
import SuiteFinalCTA from '@/components/suite/SuiteFinalCTA';
import SuiteFooter from '@/components/suite/SuiteFooter';
import SuiteNavbar from '@/components/suite/SuiteNavbar';
import SuiteMobileSticky from '@/components/suite/SuiteMobileSticky';

const SuiteLanding = () => {
  useEffect(() => {
    // SEO Meta tags
    document.title = "AMZing FBA — Le logiciel tout-en-un pour lancer et scaler Amazon FBA | Accès à vie";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'AMZing FBA : le logiciel tout-en-un pour lancer et scaler Amazon FBA. Produits rentables, outils, communauté et support inclus. Accès à vie à 1499,99€.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'AMZing FBA : le logiciel tout-en-un pour lancer et scaler Amazon FBA. Produits rentables, outils, communauté et support inclus. Accès à vie à 1499,99€.';
      document.head.appendChild(meta);
    }

    // OpenGraph
    const ogTags = [
      { property: 'og:title', content: 'AMZing FBA — Le logiciel tout-en-un pour Amazon FBA' },
      { property: 'og:description', content: 'Produits rentables, outils pro et accompagnement. Accès à vie.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://amzingfba.fr/suite' },
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // FAQ Schema JSON-LD
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "C'est une formation ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Non, c'est un logiciel tout-en-un + bibliothèque de process + accompagnement."
          }
        },
        {
          "@type": "Question",
          "name": "Combien de temps j'ai accès ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "À vie, accès illimité."
          }
        },
        {
          "@type": "Question",
          "name": "Y a-t-il des mises à jour ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Oui, toutes les mises à jour sont incluses à vie."
          }
        }
      ]
    };

    const existingSchema = document.querySelector('script[data-schema="faq"]');
    if (existingSchema) {
      existingSchema.remove();
    }
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'faq');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      const schemaScript = document.querySelector('script[data-schema="faq"]');
      if (schemaScript) schemaScript.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-suite-bg text-suite-text font-inter">
      <SuiteNavbar />
      <main>
        <SuiteHero />
        <SuiteDashboard />
        <SuiteForWho />
        <SuiteProblem />
        <SuiteSolution />
        <SuiteHowItWorks />
        <SuiteWhatYouGet />
        <SuiteDemo />
        <SuiteTestimonials />
        <SuitePricing />
        <SuiteFAQ />
        <SuiteFinalCTA />
      </main>
      <SuiteFooter />
      <SuiteMobileSticky />
    </div>
  );
};

export default SuiteLanding;
