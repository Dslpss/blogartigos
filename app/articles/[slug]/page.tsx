import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ');
  return {
    title: `${title.charAt(0).toUpperCase() + title.slice(1)} | Artigo Comunica Brasil`,
    description: `Análise técnica: ${title}.`,
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <article className="min-h-screen pt-32 pb-24 px-4 max-w-3xl mx-auto">
      <header className="mb-16 text-center">
        <span className="text-accent font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Artigo de Opinião</span>
        <h1 className="text-5xl md:text-7xl font-bold leading-[0.9] uppercase mb-12 italic">
          {slug.replace(/-/g, ' ')}
        </h1>
        <div className="h-px w-24 bg-accent mx-auto mb-8" />
        <div className="opacity-60 text-xs uppercase tracking-widest">
          Publicado em 14 de Março de 2026
        </div>
      </header>

      <div className="prose prose-invert prose-stone max-w-none font-serif text-xl leading-loose">
        <p className="first-letter:text-7xl first-letter:font-bold first-letter:text-accent first-letter:mr-3 first-letter:float-left">
          O pensamento técnico sobre os rumos da nossa sociedade exige uma análise profunda livre de amarras ideológicas.
        </p>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </p>
      </div>
    </article>
  );
}
