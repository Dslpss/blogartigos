import { Metadata } from "next";
import { getArticleBySlug } from "@/lib/db";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  const title = article ? article.title : slug.replace(/-/g, ' ');
  
  return {
    title: `${title} | Artigo Comunica Brasil`,
    description: article?.excerpt || `Análise técnica: ${title}.`,
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen pt-32 pb-24 px-4 max-w-3xl mx-auto">
      <header className="mb-16 text-center">
        <span className="text-accent font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">
          {article.category || 'Artigo de Opinião'}
        </span>
        <h1 className="text-5xl md:text-7xl font-bold leading-[0.9] uppercase mb-12 italic" style={{ color: 'var(--color-text-primary)' }}>
          {article.title}
        </h1>
        
        {article.imageUrl && (
          <div className="mb-12 rounded-2xl overflow-hidden border border-border aspect-video">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="h-px w-24 bg-accent mx-auto mb-8" />
        <div className="opacity-60 text-xs uppercase tracking-widest">
          {article.author} • {article.date}
        </div>
      </header>

      <div className="prose prose-stone max-w-none font-serif text-xl leading-loose" style={{ 
        color: 'var(--color-text-primary)',
        '--tw-prose-body': 'var(--color-text-primary)',
        '--tw-prose-headings': 'var(--color-text-primary)'
      } as any}>
        <div className="whitespace-pre-wrap">
          {article.content}
        </div>
      </div>
    </article>
  );
}
