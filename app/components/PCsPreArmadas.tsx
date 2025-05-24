"use client";

import React from 'react';
import Image from 'next/image';

interface PC {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  especificaciones: {
    procesador: string;
    placaMadre: string;
    memoria: string;
    almacenamiento: string;
    tarjetaGrafica: string;
    fuente: string;
    gabinete: string;
  };
}

const pcsPreArmadas: PC[] = [
  {
    id: 1,
    nombre: "PC Gamer Básica",
    descripcion: "Ideal para juegos casuales y trabajo diario",
    precio: 599.99,
    imagen: "/images/pc-basica.webp",
    especificaciones: {
      procesador: "AMD Ryzen 5 5600G",
      placaMadre: "ASUS PRIME B550M-A",
      memoria: "16GB DDR4 3200MHz",
      almacenamiento: "512GB SSD NVMe",
      tarjetaGrafica: "AMD Radeon Vega 7 (Integrada)",
      fuente: "EVGA 600W 80+ Bronze",
      gabinete: "Cooler Master MasterBox Q300L"
    }
  },
  {
    id: 2,
    nombre: "PC Gamer Media",
    descripcion: "Perfecta para gaming en 1080p y streaming",
    precio: 899.99,
    imagen: "/images/pc-media.webp",
    especificaciones: {
      procesador: "Intel Core i5-12400F",
      placaMadre: "MSI PRO B660M-A",
      memoria: "16GB DDR4 3600MHz",
      almacenamiento: "1TB SSD NVMe",
      tarjetaGrafica: "NVIDIA RTX 3060 12GB",
      fuente: "Corsair RM750x 750W 80+ Gold",
      gabinete: "Lian Li Lancool II Mesh"
    }
  },
  {
    id: 3,
    nombre: "PC Gamer Pro",
    descripcion: "Alto rendimiento para gaming en 1440p y 4K",
    precio: 1499.99,
    imagen: "/images/pc-pro.webp",
    especificaciones: {
      procesador: "AMD Ryzen 7 5800X3D",
      placaMadre: "ASUS ROG STRIX B550-F",
      memoria: "32GB DDR4 3600MHz",
      almacenamiento: "2TB SSD NVMe",
      tarjetaGrafica: "NVIDIA RTX 4070 12GB",
      fuente: "Seasonic PRIME TX-850 850W 80+ Titanium",
      gabinete: "Fractal Design Meshify 2"
    }
  }
];

const PCsPreArmadas: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">PCs Pre-armadas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pcsPreArmadas.map((pc) => (
          <div
            key={pc.id}
            className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300"
          >
            <div className="relative h-48 w-full">
              <Image
                src={pc.imagen}
                alt={pc.nombre}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{pc.nombre}</h3>
              <p className="text-white/80 mb-4">{pc.descripcion}</p>
              <div className="space-y-2 mb-6">
                {Object.entries(pc.especificaciones).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-white">${pc.precio.toLocaleString()}</span>
                <a
                  href={`https://wa.me/584242533942?text=Hola, me interesa la ${pc.nombre} por $${pc.precio.toLocaleString()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Consultar
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PCsPreArmadas; 