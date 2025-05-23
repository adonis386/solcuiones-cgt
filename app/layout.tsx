import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soluciones CGT",
  description: "Armá tu PC con los mejores componentes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
