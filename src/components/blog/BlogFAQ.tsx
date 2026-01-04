import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { BlogFAQ as FAQType } from '@/lib/blog-data';
import { cn } from '@/lib/utils';

interface BlogFAQProps {
  faqs: FAQType[];
  articleTitle: string;
}

const BlogFAQ = ({ faqs, articleTitle }: BlogFAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Générer le schema JSON-LD pour la FAQ
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="my-12">
      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
        <span className="text-2xl">❓</span>
        Questions Fréquentes
      </h2>
      
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-border rounded-lg overflow-hidden bg-card"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-muted/50 transition-colors"
              aria-expanded={openIndex === index}
            >
              <span className="font-semibold text-base md:text-lg pr-4">
                {faq.question}
              </span>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200",
                  openIndex === index && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                openIndex === index ? "max-h-96" : "max-h-0"
              )}
            >
              <div className="p-4 md:p-5 pt-0 text-muted-foreground leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogFAQ;
