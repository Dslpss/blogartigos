import { Metadata } from "next";
import AboutClient from "@/components/features/AboutClient";

export const metadata: Metadata = {
  title: "Sobre Nós | Comunica Brasil",
  description: "Conheça a missão e os valores por trás do Comunica Brasil, o padrão técnico da verdade.",
};

export default function AboutPage() {
  return <AboutClient />;
}
