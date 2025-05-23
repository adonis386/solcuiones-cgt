import { NextResponse } from 'next/server';

export async function GET() {
  const componentes = [
    {
      id: 1,
      nombre: "Intel Core i5-12400F",
      descripcion: "Procesador de 6 núcleos y 12 hilos, 4.4GHz",
      precio: 299.99,
      imagen_url: "/images/cpu-i5.jpg",
      categoria_id: 1,
      categoria_nombre: "Procesadores"
    },
    {
      id: 2,
      nombre: "NVIDIA RTX 3060",
      descripcion: "Tarjeta gráfica de 12GB GDDR6",
      precio: 399.99,
      imagen_url: "/images/gpu-rtx3060.jpg",
      categoria_id: 2,
      categoria_nombre: "Tarjetas Gráficas"
    },
    {
      id: 3,
      nombre: "MSI B660M",
      descripcion: "Placa base ATX con socket LGA 1700",
      precio: 149.99,
      imagen_url: "/images/motherboard-msi.jpg",
      categoria_id: 3,
      categoria_nombre: "Placas Base"
    },
    {
      id: 4,
      nombre: "Corsair Vengeance 16GB",
      descripcion: "Kit de memoria DDR4 3200MHz",
      precio: 79.99,
      imagen_url: "/images/ram-corsair.jpg",
      categoria_id: 4,
      categoria_nombre: "Memoria RAM"
    },
    {
      id: 5,
      nombre: "Samsung 970 EVO Plus",
      descripcion: "SSD NVMe de 1TB",
      precio: 129.99,
      imagen_url: "/images/ssd-samsung.jpg",
      categoria_id: 5,
      categoria_nombre: "Almacenamiento"
    }
  ];

  return NextResponse.json({ success: true, data: componentes });
} 