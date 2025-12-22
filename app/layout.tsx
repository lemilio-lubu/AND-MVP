import type { Metadata } from "next";
import { Montserrat, Geist_Mono } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AND Ecosystem | Infraestructura Financiera para Influencers",
  description: "Conectamos marcas y creadores con eficiencia fiscal y cumplimiento normativo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${montserrat.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100 font-sans`}>
        {children}
      </body>
    </html>
  );
}
