import { Metadata } from "next";
import ContactClient from "@/components/features/ContactClient";

export const metadata: Metadata = {
  title: "Fale Conosco | Comunica Brasil",
  description: "Entre em contato com nossa redação para pautas, denúncias e sugestões.",
};

export default function ContactPage() {
  return <ContactClient />;
}
