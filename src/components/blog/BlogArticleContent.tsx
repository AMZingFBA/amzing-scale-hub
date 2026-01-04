import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { BlogArticle } from '@/lib/blog-data';
import { CheckCircle, AlertTriangle, Lightbulb, TrendingUp, Info } from 'lucide-react';

interface BlogArticleContentProps {
  article: BlogArticle;
}

const BlogArticleContent = ({ article }: BlogArticleContentProps) => {
  // Composants personnalisés pour le rendu Markdown
  const components = useMemo(() => ({
    h2: ({ children, ...props }: any) => {
      const text = String(children);
      // Détection des emojis pour les titres
      const hasEmoji = /^[📌🎯💡🔥⚠️✅❌🔹🔸📊📈💰🛒📦🏆]/.test(text);
      return (
        <h2 
          className={`text-2xl md:text-3xl font-bold mt-14 mb-6 pb-3 border-b-2 border-primary/20 ${hasEmoji ? 'flex items-center gap-2' : ''}`} 
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }: any) => (
      <h3 className="text-xl md:text-2xl font-bold mt-10 mb-4 text-primary/90" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: any) => (
      <h4 className="text-lg font-bold mt-6 mb-3 text-foreground/90" {...props}>
        {children}
      </h4>
    ),
    p: ({ children, ...props }: any) => (
      <p className="mb-5 leading-relaxed text-foreground/80 text-base md:text-lg" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }: any) => (
      <ul className="mb-6 ml-2 space-y-3" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="mb-6 ml-2 space-y-3 list-none counter-reset" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ordered, ...props }: any) => (
      <li className="flex items-start gap-3 text-foreground/80 leading-relaxed" {...props}>
        <span className="mt-1.5 w-2 h-2 bg-primary rounded-full shrink-0" />
        <span>{children}</span>
      </li>
    ),
    strong: ({ children, ...props }: any) => (
      <strong className="font-bold text-foreground" {...props}>
        {children}
      </strong>
    ),
    blockquote: ({ children, ...props }: any) => {
      const text = String(children);
      const isWarning = text.includes('⚠️') || text.includes('Attention');
      const isTip = text.includes('💡') || text.includes('Conseil');
      const isSuccess = text.includes('✅');
      
      let bgColor = 'bg-primary/5 border-primary';
      let icon = <Lightbulb className="w-5 h-5 text-primary shrink-0" />;
      
      if (isWarning) {
        bgColor = 'bg-orange-500/10 border-orange-500';
        icon = <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />;
      } else if (isSuccess) {
        bgColor = 'bg-green-500/10 border-green-500';
        icon = <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />;
      } else if (isTip) {
        bgColor = 'bg-blue-500/10 border-blue-500';
        icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;
      }
      
      return (
        <blockquote className={`my-8 pl-5 pr-4 py-4 border-l-4 ${bgColor} rounded-r-lg flex items-start gap-3`} {...props}>
          {icon}
          <div className="[&>p]:mb-0 [&>p]:text-foreground/90">{children}</div>
        </blockquote>
      );
    },
    table: ({ children, ...props }: any) => (
      <div className="my-8 overflow-x-auto rounded-xl border border-border shadow-sm">
        <table className="w-full text-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: any) => (
      <thead className="bg-primary/10" {...props}>
        {children}
      </thead>
    ),
    th: ({ children, ...props }: any) => (
      <th className="px-4 py-3 text-left font-bold text-primary border-b-2 border-primary/20" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td className="px-4 py-3 border-b border-border/50 text-foreground/80" {...props}>
        {children}
      </td>
    ),
    tr: ({ children, ...props }: any) => (
      <tr className="hover:bg-muted/50 transition-colors" {...props}>
        {children}
      </tr>
    ),
    hr: () => (
      <hr className="my-10 border-border/50 border-dashed" />
    ),
    a: ({ children, href, ...props }: any) => (
      <a 
        href={href} 
        className="text-primary font-medium underline underline-offset-4 hover:text-primary/80 transition-colors decoration-primary/50 hover:decoration-primary"
        {...props}
      >
        {children}
      </a>
    ),
    code: ({ children, className, ...props }: any) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-mono" {...props}>
            {children}
          </code>
        );
      }
      return (
        <code className="block p-4 bg-muted rounded-lg overflow-x-auto text-sm font-mono border border-border" {...props}>
          {children}
        </code>
      );
    },
  }), []);

  return (
    <article className="prose prose-lg max-w-none">
      <ReactMarkdown components={components}>
        {article.content}
      </ReactMarkdown>
    </article>
  );
};

export default BlogArticleContent;
