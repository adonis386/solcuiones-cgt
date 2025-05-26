"use client";

import React from 'react';
import PCsPreArmadas from '../components/PCsPreArmadas';
import { useTheme } from '../components';

const PCsPreArmadasPage = () => {
  const { currentTheme } = useTheme();

  return (
    
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.primary} dark:${currentTheme.secondary} p-6`}>
      <div className="w-full max-w-2xl flex justify-between items-center mb-8">
        <a
          href="/"
          className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">Volver al inicio</span>
        </a>
      </div>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-4xl font-bold ${currentTheme.text} text-center mb-8 mt-8`}>
          PCs Pre-armadas
        </h1>
        <p className={`${currentTheme.text} text-center mb-12 max-w-2xl mx-auto`}>
          Descubre nuestras PCs pre-armadas optimizadas para diferentes necesidades y presupuestos. 
          Cada configuración ha sido cuidadosamente seleccionada para ofrecer el mejor rendimiento y valor.
        </p>
        <PCsPreArmadas />
      </div>
    </div>
  );
};

export default PCsPreArmadasPage; 