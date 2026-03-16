import type { Metadata } from "next";
import { Playfair_Display, Inter, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/features/Navbar";
import Footer from "@/components/features/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Comunica Brasil | Notícias e Artigos Premium",
  description: "O portal de notícias e artigos com visual premium e informação de qualidade.",
};

import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { getBlogSettings } from "@/lib/db";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getBlogSettings();

  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${playfair.variable} ${jakarta.variable} antialiased font-sans bg-background text-foreground`}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar blogName={settings.name} logoUrl={settings.logoUrl} />
            {children}
            <Footer blogName={settings.name} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
