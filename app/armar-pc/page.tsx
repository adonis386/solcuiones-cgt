"use client";

import React, { useState, useEffect } from "react";
import ComponenteCard from "../components/ComponenteCard";
import ComponentesModal from "../components/ComponentesModal";
import ChatBot from "../components/ChatBot";

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

export default function ArmarPC() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [componentesSeleccionados, setComponentesSeleccionados] = useState<Record<number, Componente>>({});
  const [presupuestoTotal, setPresupuestoTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Cargar categorías
    fetch('/api/categorias')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategorias(data.data);
        }
      })
      .catch(error => console.error('Error al cargar categorías:', error));
  }, []);

  const handleSelectComponente = (componente: Componente) => {
    setComponentesSeleccionados(prev => {
      const newSelected = { ...prev };
      if (newSelected[componente.categoria_id]) {
        delete newSelected[componente.categoria_id];
      } else {
        newSelected[componente.categoria_id] = componente;
      }
      return newSelected;
    });
  };

  useEffect(() => {
    // Calcular presupuesto total
    const total = Object.values(componentesSeleccionados).reduce(
      (sum, componente) => sum + componente.precio,
      0
    );
    setPresupuestoTotal(total);
  }, [componentesSeleccionados]);

  const handleCategoriaClick = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-6">
      <h2 className="text-3xl sm:text-4xl font-bold text-cyan-400 mt-8 mb-2 text-center animate-fade-in">
        Arma tu PC
      </h2>
      <p className="text-gray-300 mb-8 text-center animate-fade-in delay-100">
        Selecciona un componente por cada categoría para comenzar a armar tu equipo.
      </p>

      {/* Categorías */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 animate-fade-in delay-200">
        {categorias.map((cat) => (
          <div
            key={cat.id}
            className={`flex flex-col items-center bg-gray-800/80 rounded-xl shadow-lg p-6 gap-4 border transition-all cursor-pointer
              ${componentesSeleccionados[cat.id] ? 'border-cyan-400' : 'border-gray-700 hover:border-cyan-400'}`}
            onClick={() => handleCategoriaClick(cat)}
          >
            <span className="text-4xl">
              {cat.nombre === 'Motherboard' ? '🖥️' :
               cat.nombre === 'Tarjeta Gráfica' ? '🎮' :
               cat.nombre === 'Procesador' ? '🧠' :
               cat.nombre === 'Memoria RAM' ? '💾' : '🖴'}
            </span>
            <span className="text-lg font-semibold text-white">{cat.nombre}</span>
            {componentesSeleccionados[cat.id] && (
              <span className="text-sm text-cyan-400">
                {componentesSeleccionados[cat.id].nombre}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Modal de Componentes */}
      <ComponentesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoria={categoriaSeleccionada}
        onSelectComponente={handleSelectComponente}
        componentesSeleccionados={componentesSeleccionados}
      />

      {/* Presupuesto Total */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700 p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="text-white">
            <span className="text-gray-400">Presupuesto Total:</span>
            <span className="ml-2 text-xl font-bold text-cyan-400">
              ${presupuestoTotal.toLocaleString()}
            </span>
          </div>
          <div className="text-gray-400">
            {Object.keys(componentesSeleccionados).length} de {categorias.length} componentes seleccionados
          </div>
        </div>
      </div>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
} 