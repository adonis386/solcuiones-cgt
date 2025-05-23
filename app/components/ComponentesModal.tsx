"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/20">
        {/* Header */}
        <div className="bg-purple-600 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            Seleccionar {categoria.nombre}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {isLoading ? (
            <div className="text-center text-white/80">Cargando componentes...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {componentes.map((componente) => {
                const isSelected = componentesSeleccionados[categoria.id]?.id === componente.id;
                return (
                  <div
                    key={componente.id}
                    className={`bg-white/5 backdrop-blur-sm rounded-lg p-4 cursor-pointer transition-all duration-300 border
                      ${isSelected ? 'border-white shadow-lg scale-105' : 'border-white/10 hover:border-white/30'}`}
                    onClick={() => onSelectComponente(componente)}
                  >
                    <div className="aspect-video relative mb-4 rounded-lg overflow-hidden bg-white/10">
                      {componente.imagen_url ? (
                        <Image
                          src={componente.imagen_url}
                          alt={componente.nombre}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/50">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{componente.nombre}</h3>
                    <p className="text-white/70 text-sm mb-3">{componente.descripcion}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">
                        ${componente.precio.toLocaleString()}
                      </span>
                      {isSelected && (
                        <span className="text-purple-300 text-sm">Seleccionado</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 