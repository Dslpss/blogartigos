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

interface WorldClientProps {
  articles: Article[];
}

export default function WorldClient({ articles }: WorldClientProps) {
  return (
    <main className="min-h-screen px-4 py-32 max-w-7xl mx-auto">
      <header className="mb-16 border-b border-foreground/20 pb-8">
        <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">Editoria</span>
        <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter text-primary">Mundo</h1>
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
            Nenhuma notícia internacional encontrada no momento.
          </p>
        )}
      </div>
    </main>
  );
}
