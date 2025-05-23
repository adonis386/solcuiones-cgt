import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Asegúrate de que estas variables estén configuradas en Vercel
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
  // Configuración para manejar la API de LangChain
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
