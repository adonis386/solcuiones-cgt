"use client";

import React, { useState, useEffect } from 'react';
import ComponenteCard from './ComponenteCard';

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
  categoria: {
    id: number;
    nombre: string;
  } | null;
  onSelectComponente: (componente: Componente) => void;
  componentesSeleccionados: Record<number, Componente>;
}

export default function ComponentesModal({
  isOpen,
  onClose,
  categoria,
  onSelectComponente,
  componentesSeleccionados
}: ComponentesModalProps) {
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchComponentes = async () => {
      if (!categoria) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/componentes/categoria/${categoria.id}`);
        const data = await response.json();
        if (data.success) {
          setComponentes(data.data);
        }
      } catch (error) {
        console.error('Error al cargar componentes:', error);
      }
      setIsLoading(false);
    };

    if (isOpen && categoria) {
      fetchComponentes();
    }
  }, [isOpen, categoria]);

  if (!isOpen || !categoria) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            Selecciona tu {categoria.nombre}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {isLoading ? (
            <div className="text-center text-gray-400">Cargando componentes...</div>
          ) : componentes.length === 0 ? (
            <div className="text-center text-gray-400">No hay componentes disponibles en esta categoría.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {componentes.map((componente) => (
                <ComponenteCard
                  key={componente.id}
                  componente={componente}
                  onSelect={onSelectComponente}
                  isSelected={componentesSeleccionados[componente.categoria_id]?.id === componente.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-400 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
} 