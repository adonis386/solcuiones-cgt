import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components";
import ThemeSelector from "./components/ThemeSelector";

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
      <body className="font-goldman">
        <ThemeProvider>
          <div className="relative">
            <ThemeSelector />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
