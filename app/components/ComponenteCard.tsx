"use client";

import React from 'react';
import Image from 'next/image';

interface Componente {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria_id: number;
  imagen_url: string;
  categoria_nombre: string;
}

interface ComponenteCardProps {
  componente: Componente;
  onSelect: (componente: Componente) => void;
  isSelected: boolean;
}

export default function ComponenteCard({ componente, onSelect, isSelected }: ComponenteCardProps) {
  return (
    <div 
      className={`flex flex-col bg-gray-800/80 rounded-xl p-6 gap-4 border transition-all cursor-pointer
        ${isSelected 
          ? 'border-cyan-400 scale-105 shadow-[0_0_20px_rgba(103,232,249,0.6)]' 
          : 'border-gray-700 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(103,232,249,0.4)]'}`}
      onClick={() => onSelect(componente)}
    >
      <div className="relative w-full h-48 mb-4">
        <Image
          src={componente.imagen_url || '/placeholder.png'}
          alt={componente.nombre}
          fill
          className="object-contain rounded-lg"
        />
      </div>
      <h3 className="text-xl font-bold text-white">{componente.nombre}</h3>
      <p className="text-gray-300 text-sm flex-grow">{componente.descripcion}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-2xl font-bold text-cyan-400">${componente.precio}</span>
        <button 
          className={`px-4 py-2 rounded-full text-white font-semibold transition-all
            ${isSelected 
              ? 'bg-cyan-500 hover:bg-cyan-400' 
              : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          {isSelected ? 'Seleccionado' : 'Seleccionar'}
        </button>
      </div>
    </div>
  );
} 