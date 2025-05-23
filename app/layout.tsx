import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { turretRoad } from "./fonts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soluciones CGT",
  description: "Arma tu PC ideal con ayuda de la inteligencia artificial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${turretRoad.variable} font-sans`}>{children}</body>
    </html>
  );
}
