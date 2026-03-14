"use client";

import NewsCard from "@/components/features/NewsCard";

export default function NewsClient() {
  return (
    <main className="min-h-screen px-4 py-32 max-w-7xl mx-auto">
      <header className="mb-16 border-b border-foreground/20 pb-8 flex justify-between items-end">
        <div>
          <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">Feed</span>
          <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter">Notícias</h1>
        </div>
        <p className="max-w-xs text-right opacity-60 italic font-serif hidden md:block">
          Cobertura em tempo real com o rigor técnico que o jornalismo moderno exige.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <NewsCard 
          slug="stf-prisao-conselheiro"
          category="Brasil / Política"
          title="STF forma maioria para manter prisão de ex-conselheiro do TCE."
          excerpt="Decisão impacta diretamente o cenário político regional e reforça combate à corrupção."
          image="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=2070&auto=format&fit=crop"
          date="14/03/2026"
        />
        <NewsCard 
          slug="justica-tranca-acao"
          category="Mundo / Direito"
          title="Justiça tranca ação por transfobia e estudante é absolvido."
          excerpt="O caso foi encerrado após a defesa apresentar novas provas de que não houve dolo na conduta."
          image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop"
          date="14/03/2026"
        />
      </div>
    </main>
  );
}
