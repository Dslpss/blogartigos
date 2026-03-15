import { Metadata } from "next";
import BahiaClient from "@/components/features/BahiaClient";
import { getArticles } from "@/lib/db";

export const metadata: Metadata = {
  title: "Bahia | Comunica Brasil",
  description: "Cobertura regional completa com foco em inovação e cultura na Bahia.",
};

export default async function BahiaPage() {
  const articles = await getArticles();
  const bahiaArticles = articles.filter(a => a.category.toLowerCase().includes('bahia') || a.region?.toLowerCase() === 'bahia');

  const formattedArticles = bahiaArticles.map(a => ({
    ...a,
    id: a.id || Math.random().toString(),
    createdAt: a.createdAt?.toDate().toISOString() || new Date().toISOString()
  }));

  return <BahiaClient articles={formattedArticles as any} />;
}
