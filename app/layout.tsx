import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soluciones CGT - Ensamblador de PC con IA",
  description: "Ensambla tu PC ideal con ayuda de la inteligencia artificial. Elige los mejores componentes y ajusta tu presupuesto fácilmente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
