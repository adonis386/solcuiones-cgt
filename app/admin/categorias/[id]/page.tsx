"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditarCategoria() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [nombre, setNombre] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const response = await fetch(`/api/categorias/${id}`);
        const data = await response.json();
        if (data.success) {
          setNombre(data.data.nombre);
        }
      } catch (error) {
        console.error('Error al cargar categoría:', error);
        setError('Error al cargar la categoría');
      }
      setIsLoading(false);
    };

    if (id !== 'nueva') {
      fetchCategoria();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const method = id === 'nueva' ? 'POST' : 'PUT';
      const response = await fetch(`/api/categorias${id === 'nueva' ? '' : `/${id}`}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre }),
      });

      const data = await response.json();
      if (data.success) {
        router.push('/admin');
      } else {
        setError(data.error || 'Error al guardar la categoría');
      }
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      setError('Error al guardar la categoría');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center text-gray-400">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-cyan-400 mb-8">
          {id === 'nueva' ? 'Nueva Categoría' : 'Editar Categoría'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-white mb-2">
              Nombre de la Categoría
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-colors"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 