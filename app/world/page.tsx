import { Metadata } from "next";
import WorldClient from "@/components/features/WorldClient";
import { getArticles } from "@/lib/db";

export const metadata: Metadata = {
  title: "Mundo | Comunica Brasil",
  description: "Análise global e notícias internacionais com foco em tecnologia e economia.",
};

export default async function WorldPage() {
  const articles = await getArticles();
  const worldArticles = articles.filter(a => a.category.toLowerCase().includes('mundo') || a.region?.toLowerCase() === 'internacional' || a.region?.toLowerCase() === 'mundo');

  const formattedArticles = worldArticles.map(a => ({
    ...a,
    id: a.id || Math.random().toString(),
    createdAt: a.createdAt?.toDate().toISOString() || new Date().toISOString()
  }));

  return <WorldClient articles={formattedArticles as any} />;
}
