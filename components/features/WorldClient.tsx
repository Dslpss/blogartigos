"use client";

import NewsCard from "@/components/features/NewsCard";

export default function WorldClient() {
  return (
    <main className="min-h-screen px-4 py-32 max-w-7xl mx-auto">
      <header className="mb-16 border-b border-foreground/20 pb-8">
        <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">Editoria</span>
        <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter">Mundo</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <NewsCard 
          slug="crise-energia-europa"
          category="Mundo / Economia"
          title="Europa acelera transição energética após novos relatórios."
          excerpt="Dados mostram que o investimento em eólica superou as expectativas do primeiro trimestre."
          image="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=2070&auto=format&fit=crop"
          date="14/03/2026"
        />
      </div>
    </main>
  );
}
