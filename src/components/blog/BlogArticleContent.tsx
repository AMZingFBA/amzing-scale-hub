import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { BlogArticle } from '@/lib/blog-data';

interface BlogArticleContentProps {
  article: BlogArticle;
}

const BlogArticleContent = ({ article }: BlogArticleContentProps) => {
  // Composants personnalisés pour le rendu Markdown
  const components = useMemo(() => ({
    h2: ({ children, ...props }: any) => (
      <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-6 pb-3 border-b border-border" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: any) => (
      <h4 className="text-lg font-bold mt-6 mb-3" {...props}>
        {children}
      </h4>
    ),
    p: ({ children, ...props }: any) => (
      <p className="mb-4 leading-relaxed text-muted-foreground" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }: any) => (
      <ul className="mb-4 ml-6 space-y-2 list-disc marker:text-primary" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="mb-4 ml-6 space-y-2 list-decimal marker:text-primary marker:font-bold" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="text-muted-foreground leading-relaxed" {...props}>
        {children}
      </li>
    ),
    strong: ({ children, ...props }: any) => (
      <strong className="font-bold text-foreground" {...props}>
        {children}
      </strong>
    ),
    blockquote: ({ children, ...props }: any) => (
      <blockquote className="my-6 pl-6 border-l-4 border-primary bg-primary/5 py-4 pr-4 rounded-r-lg" {...props}>
        {children}
      </blockquote>
    ),
    table: ({ children, ...props }: any) => (
      <div className="my-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: any) => (
      <thead className="bg-muted/50" {...props}>
        {children}
      </thead>
    ),
    th: ({ children, ...props }: any) => (
      <th className="px-4 py-3 text-left font-bold border-b border-border" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td className="px-4 py-3 border-b border-border/50" {...props}>
        {children}
      </td>
    ),
    hr: () => (
      <hr className="my-8 border-border" />
    ),
    a: ({ children, href, ...props }: any) => (
      <a 
        href={href} 
        className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
        {...props}
      >
        {children}
      </a>
    ),
    code: ({ children, className, ...props }: any) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono" {...props}>
            {children}
          </code>
        );
      }
      return (
        <code className="block p-4 bg-muted rounded-lg overflow-x-auto text-sm font-mono" {...props}>
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
