"use client";

import NewsCard from "@/components/features/NewsCard";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  slug: string;
  imageUrl?: string;
}

interface NewsClientProps {
  articles: Article[];
}

export default function NewsClient({ articles }: NewsClientProps) {
  return (
    <main className="min-h-screen px-4 py-32 max-w-7xl mx-auto">
      <header className="mb-16 border-b border-foreground/20 pb-8 flex justify-between items-end">
        <div>
          <span className="text-highlight font-bold uppercase tracking-widest text-sm mb-4 block">Feed</span>
          <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter text-primary">Notícias</h1>
        </div>
        <p className="max-w-xs text-right opacity-60 italic font-serif hidden md:block text-primary">
          Cobertura em tempo real com o rigor técnico que o jornalismo moderno exige.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-primary">
        {articles.length > 0 ? (
          articles.map((article) => (
            <NewsCard 
              key={article.id}
              {...article}
            />
          ))
        ) : (
          <p className="col-span-full text-center py-20 opacity-40 font-bold uppercase tracking-widest text-xs">
            Nenhuma notícia encontrada no momento.
          </p>
        )}
      </div>
    </main>
  );
}
