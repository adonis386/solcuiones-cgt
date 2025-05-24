"use client";

import React from 'react';
import PCsPreArmadas from '../components/PCsPreArmadas';

const PCsPreArmadasPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 dark:from-purple-700 dark:via-purple-600 dark:to-purple-500 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8 mt-8">
          PCs Pre-armadas
        </h1>
        <p className="text-white text-center mb-12 max-w-2xl mx-auto">
          Descubre nuestras PCs pre-armadas optimizadas para diferentes necesidades y presupuestos. 
          Cada configuración ha sido cuidadosamente seleccionada para ofrecer el mejor rendimiento y valor.
        </p>
        <PCsPreArmadas />
      </div>
    </div>
  );
};

export default PCsPreArmadasPage; 