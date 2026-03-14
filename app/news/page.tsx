import { Metadata } from "next";
import NewsClient from "@/components/features/NewsClient";

export const metadata: Metadata = {
  title: "Últimas Notícias | Comunica Brasil",
  description: "Fique por dentro das últimas notícias do Brasil e do mundo com análise técnica e independência.",
};

export default function NewsPage() {
  return <NewsClient />;
}
