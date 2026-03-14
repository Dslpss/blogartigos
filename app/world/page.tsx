import { Metadata } from "next";
import WorldClient from "@/components/features/WorldClient";

export const metadata: Metadata = {
  title: "Mundo | Comunica Brasil",
  description: "Análise global e notícias internacionais com foco em tecnologia e economia.",
};

export default function WorldPage() {
  return <WorldClient />;
}
