import { Metadata } from "next";
import HomeClient from "@/components/features/HomeClient";
import { getBlogSettings, getArticles } from "@/lib/db";

export const metadata: Metadata = {
  title: "Comunica Brasil | Jornalismo Técnico e Independente",
  description: "As principais notícias do Brasil e do mundo com análise técnica e profundidade.",
};

export default async function Home() {
  const [settings, articles] = await Promise.all([
    getBlogSettings(),
    getArticles()
  ]);

  const formattedArticles = articles.map(a => ({
    ...a,
    id: a.id || Math.random().toString(),
    createdAt: a.createdAt?.toDate().toISOString() || new Date().toISOString()
  }));

  return <HomeClient articles={formattedArticles as any} blogName={settings.name} />;
}
