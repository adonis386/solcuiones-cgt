import { NextResponse } from 'next/server';

export async function GET() {
  const categorias = [
    {
      id: 1,
      nombre: "Procesadores",
      descripcion: "Unidades centrales de procesamiento (CPU)"
    },
    {
      id: 2,
      nombre: "Tarjetas Gráficas",
      descripcion: "Unidades de procesamiento gráfico (GPU)"
    },
    {
      id: 3,
      nombre: "Placas Base",
      descripcion: "Tarjetas principales del sistema"
    },
    {
      id: 4,
      nombre: "Memoria RAM",
      descripcion: "Memoria de acceso aleatorio"
    },
    {
      id: 5,
      nombre: "Almacenamiento",
      descripcion: "Discos duros y unidades SSD"
    }
  ];

  return NextResponse.json({ success: true, data: categorias });
} 