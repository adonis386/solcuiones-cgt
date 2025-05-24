"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 dark:from-purple-700 dark:via-purple-600 dark:to-purple-500 p-6">
      <div className="text-center space-y-8 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-white animate-slide-down">
          Bienvenido a Soluciones CGT
        </h1>
        
        <p className="text-xl text-white/90 animate-slide-up delay-200">
          Arma tu PC ideal con ayuda de la inteligencia artificial
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-500">
          <Link
            href="/armar-pc"
            className="inline-block px-12 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Armar mi PC
          </Link>
          <Link
            href="/pcs-prearmadas"
            className="inline-block px-12 py-4 bg-purple-700 text-white rounded-lg font-semibold text-lg hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
          >
            Ver PCs Pre-armadas
          </Link>
        </div>
      </div>
    </div>
  );
}
