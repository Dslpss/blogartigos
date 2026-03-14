import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ');
  return {
    title: `${title.charAt(0).toUpperCase() + title.slice(1)} | Comunica Brasil`,
    description: `Leia mais sobre ${title} no Comunica Brasil.`,
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <article className="min-h-screen pt-48 pb-24 px-6 max-w-[1200px] mx-auto">
      <header className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-accent font-black uppercase tracking-[0.5em] text-[10px] bg-accent/5 py-2 px-6 border border-accent/10 backdrop-blur-md">
            Brasil / Política
          </span>
          <div className="h-[1px] w-12 bg-accent/30" />
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black leading-[0.85] uppercase tracking-tighter mb-12 italic text-primary">
          {slug.replace(/-/g, ' ')}
        </h1>
        
        <div className="flex items-center justify-between border-y border-primary/5 py-8 text-primary">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-mono text-xs font-black">
              CB
            </div>
            <div className="flex flex-col">
              <span className="font-black uppercase tracking-widest text-[10px]">Por Equipe Comunica Brasil</span>
              <span className="opacity-40 font-mono text-[9px] uppercase tracking-widest">Protocolo: 2026_MAR_14</span>
            </div>
          </div>
          <time className="font-mono text-[10px] opacity-40 uppercase tracking-[0.3em]">14_MARÇO_2026</time>
        </div>
      </header>

      <div className="aspect-[21/9] bg-primary/5 overflow-hidden mb-20 relative group">
        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="absolute inset-8 border border-primary/5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 prose prose-2xl prose-primary prose-invert-none max-w-none font-serif text-primary leading-relaxed space-y-12">
          <p className="text-3xl md:text-4xl font-sans font-black leading-tight italic border-l-8 border-accent pl-10 mb-16">
            Esta é uma página de detalhe dinâmica para a notícia. O conteúdo será carregado do Firestore garantindo precisão técnica.
          </p>
          <p className="opacity-70">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="opacity-70">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        
        <aside className="lg:col-span-4 space-y-12">
          <div className="glass-panel p-10 bg-white shadow-sm border-primary/5">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-accent mb-6">CONTEXTO_TÉCNICO</h4>
            <div className="space-y-4 opacity-60 font-mono text-[10px] leading-relaxed uppercase">
              <p>Status: Transmissão_Ativa</p>
              <p>Fonte: CB_Analytics_Hub</p>
              <p>Região: LATAM_BRASIL</p>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
