import { Metadata } from "next";
import BahiaClient from "@/components/features/BahiaClient";

export const metadata: Metadata = {
  title: "Bahia | Comunica Brasil",
  description: "Cobertura regional completa com foco em inovação e cultura na Bahia.",
};

export default function BahiaPage() {
  return <BahiaClient />;
}
