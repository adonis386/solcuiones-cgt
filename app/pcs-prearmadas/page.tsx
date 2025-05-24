"use client";

import React from 'react';
import PCsPreArmadas from '../components/PCsPreArmadas';
import { useTheme } from '../components';

const PCsPreArmadasPage = () => {
  const { currentTheme } = useTheme();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.primary} dark:${currentTheme.secondary} p-6`}>
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