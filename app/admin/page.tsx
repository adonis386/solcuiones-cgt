"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function AdminPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const [activeTab, setActiveTab] = useState<'categorias' | 'componentes'>('categorias');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'categorias') {
        const response = await fetch('/api/test-db');
        const data = await response.json();
        if (data.success) {
          setCategorias(data.data);
        }
      } else {
        const response = await fetch('/api/componentes');
        const data = await response.json();
        if (data.success) {
          setComponentes(data.data);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDelete = async (id: number, type: 'categoria' | 'componente') => {
    if (!confirm('¿Estás seguro de que deseas eliminar este elemento?')) return;

    try {
      const response = await fetch(`/api/${type}s/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        fetchData();
      } else {
        alert('Error al eliminar el elemento');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar el elemento');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400">Panel de Administración</h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'categorias'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('categorias')}
          >
            Categorías
          </button>
          <button
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === 'componentes'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('componentes')}
          >
            Componentes
          </button>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-xl p-6">
          {isLoading ? (
            <div className="text-center text-gray-400">Cargando...</div>
          ) : (
            <>
              {activeTab === 'categorias' ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Lista de Categorías</h2>
                    <Link
                      href="/admin/categorias/nueva"
                      className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-colors"
                    >
                      Nueva Categoría
                    </Link>
                  </div>
                  <div className="grid gap-4">
                    {categorias.map((categoria) => (
                      <div
                        key={categoria.id}
                        className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
                      >
                        <span className="text-white">{categoria.nombre}</span>
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/categorias/${categoria.id}`}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400 transition-colors"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(categoria.id, 'categoria')}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400 transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Lista de Componentes</h2>
                    <Link
                      href="/admin/componentes/nuevo"
                      className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-colors"
                    >
                      Nuevo Componente
                    </Link>
                  </div>
                  <div className="grid gap-4">
                    {componentes.map((componente) => (
                      <div
                        key={componente.id}
                        className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
                      >
                        <div className="flex flex-col">
                          <span className="text-white font-semibold">{componente.nombre}</span>
                          <span className="text-gray-400 text-sm">{componente.categoria_nombre}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/componentes/${componente.id}`}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400 transition-colors"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(componente.id, 'componente')}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400 transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 