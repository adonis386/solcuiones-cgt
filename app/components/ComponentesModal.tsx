"use client";

import React, {  } from 'react';
import ComponenteCard from './ComponenteCard';

interface Categoria {
  id: number;
  nombre: string;
}

interface Componente {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria_id: number;
  imagen_url: string;
  categoria_nombre: string;
}

interface ComponentesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoria: Categoria | null;
  onSelectComponente: (componente: Componente) => void;
  componentesSeleccionados: Record<number, Componente>;
  componentes: Componente[];
  onNext: () => void;
}

export default function ComponentesModal({
  isOpen,
  onClose,
  categoria,
  onSelectComponente,
  componentesSeleccionados,
  componentes,
  onNext
}: ComponentesModalProps) {
  if (!isOpen || !categoria) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl w-[95%] max-w-6xl max-h-[90vh] overflow-hidden border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{categoria.nombre}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {componentes.map((componente) => (
              <ComponenteCard
                key={componente.id}
                componente={componente}
                onSelect={onSelectComponente}
                isSelected={componentesSeleccionados[categoria.id]?.id === componente.id}
              />
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-gray-700 flex  items-center bg-gray-800/50">
          <button
            onClick={onNext}
            className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700/50"
          >
            <span>Omitir este componente</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={onNext}
            className="bg-purple-700 hover:bg-purple-600 text-white px-8 py-3 rounded-lg transition-all flex items-center gap-2 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 min-w-[200px]"
          >
            <span>Siguiente</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 