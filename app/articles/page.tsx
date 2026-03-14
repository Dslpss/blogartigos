import { Metadata } from "next";
import ArticlesClient from "@/components/features/ArticlesClient";

export const metadata: Metadata = {
  title: "Artigos e Opinião | Comunica Brasil",
  description: "Reflexões profundas sobre tecnologia, sociedade e política brasileira.",
};

const mockArticles = [
  {
    id: '1',
    title: 'A Ascensão da Economia Digital no Brasil',
    excerpt: 'Como as fintechs e a digitalização estão transformando o cenário financeiro nacional em 2024.',
    category: 'ECONOMIA',
    date: '14 Mar 2026',
    slug: 'ascensao-economia-digital'
  },
  {
    id: '2',
    title: 'IA e o Futuro do Trabalho Técnico',
    excerpt: 'Análise profunda sobre como a automação inteligente está redefinindo as competências necessárias para o mercado.',
    category: 'TECNOLOGIA',
    date: '13 Mar 2026',
    slug: 'ia-futuro-trabalho'
  },
  {
    id: '3',
    title: 'Energia Limpa: O Protocolo de Sustentabilidade',
    excerpt: 'O Brasil se posiciona como líder na transição energética global com novos parques eólicos.',
    category: 'SOCIEDADE',
    date: '12 Mar 2026',
    slug: 'energia-limpa-brasil'
  },
  {
    id: '4',
    title: 'Cibersegurança em Ambientes Híbridos',
    excerpt: 'Novas ameaças exigem protocolos de defesa mais robustos e descentralizados.',
    category: 'TECNOLOGIA',
    date: '11 Mar 2026',
    slug: 'ciberseguranca-hibrida'
  },
  {
    id: '5',
    title: 'Infraestrutura 5G e Conectividade Rural',
    excerpt: 'O impacto da chegada do 5G no agronegócio e a integração das fronteiras produtivas.',
    category: 'ECONOMIA',
    date: '10 Mar 2026',
    slug: '5g-conectividade-rural'
  }
];

export default function ArticlePage() {
  return <ArticlesClient articles={mockArticles} />;
}
