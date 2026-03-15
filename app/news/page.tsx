import { Metadata } from "next";
import NewsClient from "@/components/features/NewsClient";
import { getArticles } from "@/lib/db";

export const metadata: Metadata = {
  title: "Últimas Notícias | Comunica Brasil",
  description: "Fique por dentro das últimas notícias do Brasil e do mundo com análise técnica e independência.",
};

export default async function NewsPage() {
  const articles = await getArticles();
  
  const formattedArticles = articles.map(a => ({
    ...a,
    id: a.id || Math.random().toString(),
    createdAt: a.createdAt?.toDate().toISOString() || new Date().toISOString()
  }));

  return <NewsClient articles={formattedArticles as any} />;
}
