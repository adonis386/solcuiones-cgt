"use client";

import React, { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Categoria {
  id: number;
  nombre: string;
}

export default function EditarComponente({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: '',
    imagen_url: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategorias = useCallback(async () => {
    try {
      const response = await fetch('/api/categorias');
      const data = await response.json();
      if (data.success) {
        setCategorias(data.data);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setError('Error al cargar las categorías');
    }
  }, []);

  const fetchComponente = useCallback(async () => {
    try {
      const response = await fetch(`/api/componentes/${resolvedParams.id}`);
      const data = await response.json();
      if (data.success) {
        setFormData({
          nombre: data.data.nombre,
          descripcion: data.data.descripcion,
          precio: data.data.precio.toString(),
          categoria_id: data.data.categoria_id.toString(),
          imagen_url: data.data.imagen_url || ''
        });
      }
    } catch (error) {
      console.error('Error al cargar componente:', error);
      setError('Error al cargar el componente');
    }
    setIsLoading(false);
  }, [resolvedParams.id]);

  useEffect(() => {
    fetchCategorias();
    if (resolvedParams.id !== 'nuevo') {
      fetchComponente();
    } else {
      setIsLoading(false);
    }
  }, [resolvedParams.id, fetchCategorias, fetchComponente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const method = resolvedParams.id === 'nuevo' ? 'POST' : 'PUT';
      const response = await fetch(`/api/componentes${resolvedParams.id === 'nuevo' ? '' : `/${resolvedParams.id}`}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          precio: parseFloat(formData.precio),
          categoria_id: parseInt(formData.categoria_id)
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push('/admin');
      } else {
        setError(data.error || 'Error al guardar el componente');
      }
    } catch (error) {
      console.error('Error al guardar componente:', error);
      setError('Error al guardar el componente');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
          {resolvedParams.id === 'nuevo' ? 'Nuevo Componente' : 'Editar Componente'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-white mb-2">
              Nombre del Componente
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-white mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              rows={4}
              required
            />
          </div>

          <div>
            <label htmlFor="precio" className="block text-white mb-2">
              Precio
            </label>
            <input
              type="number"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="categoria_id" className="block text-white mb-2">
              Categoría
            </label>
            <select
              id="categoria_id"
              name="categoria_id"
              value={formData.categoria_id}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="imagen_url" className="block text-white mb-2">
              URL de la Imagen
            </label>
            <input
              type="text"
              id="imagen_url"
              name="imagen_url"
              value={formData.imagen_url}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="https://ejemplo.com/imagen.jpg"
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