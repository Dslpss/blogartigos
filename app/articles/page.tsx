import { Metadata } from "next";
import ArticlesClient from "@/components/features/ArticlesClient";
import { getArticles } from "@/lib/db";

export const metadata: Metadata = {
  title: "Artigos e Opinião | Comunica Brasil",
  description: "Reflexões profundas sobre tecnologia, sociedade e política brasileira.",
};

export default async function ArticlePage() {
  const articles = await getArticles();
  
  const formattedArticles = articles.map(a => ({
    ...a,
    id: a.id || Math.random().toString(),
    createdAt: a.createdAt?.toDate().toISOString() || new Date().toISOString()
  }));

  return <ArticlesClient articles={formattedArticles as any} />;
}
