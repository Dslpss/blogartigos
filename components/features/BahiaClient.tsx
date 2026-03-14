"use client";

import NewsCard from "@/components/features/NewsCard";

export default function BahiaClient() {
  return (
    <main className="min-h-screen px-4 py-32 max-w-7xl mx-auto">
      <header className="mb-16 border-b border-foreground/20 pb-8">
        <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">Regional</span>
        <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter">Bahia</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <NewsCard 
          slug="carnaval-tecnologico"
          category="Bahia / Cultura"
          title="Salvador planeja o primeiro Carnaval 100% tecnológico."
          excerpt="Uso de blockchain para ingressos e segurança preditiva com drones devem marcar a folia baiana."
          image="https://images.unsplash.com/photo-1606064934508-73f08e379a91?q=80&w=2070&auto=format&fit=crop"
          date="14/03/2026"
        />
      </div>
    </main>
  );
}
