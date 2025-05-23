"use client";

import React, { useState, useRef, useEffect } from 'react';

interface ChatBotProps {
  presupuestoObjetivo: number | '';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
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

interface ComponentesEstaticos {
  [key: number]: Componente[];
}

// Datos estáticos de componentes para referencia
const componentesEstaticos: ComponentesEstaticos = {
  1: [ // Procesadores
    {
      id: 1,
      nombre: "AMD Ryzen 5 5600GT",
      descripcion: "Procesador Hexa-Core 3.6GHz, Socket AM4, 19MB caché, 65W TDP, Radeon Graphics",
      precio: 155,
      imagen_url: "/componentes/ryzen-5600gt.jpg",
      categoria_id: 1,
      categoria_nombre: "Procesadores"
    },
    {
      id: 2,
      nombre: "AMD Ryzen 7 5700X",
      descripcion: "Procesador Octa-Core 3.8GHz, Socket AM4, 16MB caché, 65W TDP",
      precio: 205,
      imagen_url: "/componentes/ryzen-5700x.jpg",
      categoria_id: 1,
      categoria_nombre: "Procesadores"
    },
    {
      id: 3,
      nombre: "Intel Core i5-12400",
      descripcion: "Procesador 12th Gen 2.5GHz, Socket 1700, 18MB caché, 65W TDP",
      precio: 175,
      imagen_url: "/componentes/i5-12400.jpg",
      categoria_id: 1,
      categoria_nombre: "Procesadores"
    }
  ],
  2: [ // Tarjetas Gráficas
    {
      id: 10,
      nombre: "ASRock Radeon RX 6600 Challenger D",
      descripcion: "8GB GDDR6, 128-bit, 1626MHz, 500W, HDMI-3xDP",
      precio: 260,
      imagen_url: "/componentes/rx-6600-challenger.jpg",
      categoria_id: 2,
      categoria_nombre: "Tarjetas Gráficas"
    },
    {
      id: 11,
      nombre: "ASUS GeForce RTX 3060 Dual V2 OC",
      descripcion: "12GB GDDR6, 192-bit, 1867MHz, 650W, HDMI-DP",
      precio: 390,
      imagen_url: "/componentes/rtx-3060-dual.jpg",
      categoria_id: 2,
      categoria_nombre: "Tarjetas Gráficas"
    }
  ],
  3: [ // Placas Base
    {
      id: 12,
      nombre: "ASUS Prime A520M-K",
      descripcion: "MATX Socket AM4, 2xDDR4-4600, 4xSATA, M.2, 3xPCIe, HD 7.1, 6xUSB, HDMI-D-SUB",
      precio: 70,
      imagen_url: "/componentes/asus-a520m-k.jpg",
      categoria_id: 3,
      categoria_nombre: "Placas Base"
    },
    {
      id: 13,
      nombre: "Gigabyte A520M K V2",
      descripcion: "MATX Socket AM4, 2xDDR4-5100, 4xSATA, M.2, 2xPCIe, HD 7.1, 4xUSB, HDMI-VGA",
      precio: 60,
      imagen_url: "/componentes/gigabyte-a520m-k.jpg",
      categoria_id: 3,
      categoria_nombre: "Placas Base"
    },
    {
      id: 14,
      nombre: "ECS B660HT-M22",
      descripcion: "MATX LGA1700, 2xDDR4-4600, 4xSATA, 6xUSB3.2+5xUSB2.0, 2xM.2, UHD, 4xPCIe, HDMI-VGA, Gen 14th-13th-12th",
      precio: 90,
      imagen_url: "/componentes/ecs-b660ht-m22.jpg",
      categoria_id: 3,
      categoria_nombre: "Placas Base"
    },
    {
      id: 15,
      nombre: "MSI PRO Z790-A MAX WIFI",
      descripcion: "ATX Socket LGA1700, 4xDDR5-7800, 6xSATA, 4xM.2, 4xPCIe, 14xUSB, HDMI-DP, Gen 14th-13th-12th",
      precio: 285,
      imagen_url: "/componentes/msi-z790-a.jpg",
      categoria_id: 3,
      categoria_nombre: "Placas Base"
    }
  ],
  4: [ // Memoria RAM
    {
      id: 6,
      nombre: "Corsair Vengeance RGB 16GB",
      descripcion: "Memoria DDR4 3200MHz, RGB, UDIMM",
      precio: 36,
      imagen_url: "/componentes/corsair-vengeance-rgb.jpg",
      categoria_id: 4,
      categoria_nombre: "Memoria RAM"
    },
    {
      id: 7,
      nombre: "XPG Gammix D30 8GB",
      descripcion: "Memoria DDR4 3200MHz, Con disipador, UDIMM",
      precio: 23,
      imagen_url: "/componentes/xpg-gammix-d30.jpg",
      categoria_id: 4,
      categoria_nombre: "Memoria RAM"
    }
  ],
  5: [ // Almacenamiento
    {
      id: 8,
      nombre: "XPG Gammix S60 512GB",
      descripcion: "SSD M.2 2280, PCIe 4x4, 5000MB/s",
      precio: 52,
      imagen_url: "/componentes/xpg-gammix-s60.jpg",
      categoria_id: 5,
      categoria_nombre: "Almacenamiento"
    },
    {
      id: 9,
      nombre: "ADATA Legend 710 256GB",
      descripcion: "SSD M.2 2280, PCIe Gen3 x4",
      precio: 24,
      imagen_url: "/componentes/adata-legend-710.jpg",
      categoria_id: 5,
      categoria_nombre: "Almacenamiento"
    }
  ],
  6: [ // Fuentes de Poder
    {
      id: 5,
      nombre: "Azza 750W Gaming ATX",
      descripcion: "Fuente 750W 80+ Bronze, 12V, 100-240V, Fan ARGB, Negro",
      precio: 62,
      imagen_url: "/componentes/azza-750w.jpg",
      categoria_id: 6,
      categoria_nombre: "Fuentes de Poder"
    }
  ],
  7: [ // Gabinetes
    {
      id: 16,
      nombre: "MSI MAG Shield M301",
      descripcion: "MTX, 3xUSB, 1HD Audio, 1 Fan 120mm, Negro",
      precio: 38,
      imagen_url: "/componentes/msi-mag-shield.jpg",
      categoria_id: 7,
      categoria_nombre: "Gabinetes"
    },
    {
      id: 17,
      nombre: "Gamemax Gaming Diamond COC",
      descripcion: "Mid Tower, 2xUSB 3.0, 1HD Audio, Fan COC 14cm, ARGB, Lateral Vidrio Temp, Negro",
      precio: 65,
      imagen_url: "/componentes/gamemax-diamond.jpg",
      categoria_id: 7,
      categoria_nombre: "Gabinetes"
    },
    {
      id: 18,
      nombre: "Cooler Master HAF500",
      descripcion: "Mid Tower, 2xUSB3.2, Type C, HD Audio, 2xFan 20cm+2xFan 12cm, ARGB, Frontal Mall, Negro",
      precio: 167,
      imagen_url: "/componentes/cooler-master-haf500.jpg",
      categoria_id: 7,
      categoria_nombre: "Gabinetes"
    }
  ],
  8: [ // Refrigeración
    {
      id: 4,
      nombre: "Gamemax Gamma 600",
      descripcion: "Cooler ARGB 4 pines, 230W TDP, Compatible Intel LGA2066 y AMD AM4",
      precio: 50,
      imagen_url: "/componentes/gamemax-gamma-600.jpg",
      categoria_id: 8,
      categoria_nombre: "Refrigeración"
    }
  ]
};

export default function ChatBot({ presupuestoObjetivo }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          presupuesto: presupuestoObjetivo,
          history: messages,
          componentes: componentesEstaticos // Enviamos los componentes como referencia
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.' 
      }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-700 text-white p-4 rounded-full shadow-lg hover:bg-purple-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      ) : (
        <div className="bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl w-96 border border-gray-700">
          {/* Header */}
          <div className="bg-purple-700 p-4 rounded-t-xl flex justify-between items-center">
            <h3 className="text-white font-semibold">Asistente Virtual</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-300">
                <p>¡Hola! Soy tu asistente virtual.</p>
                <p className="mt-2">Puedo ayudarte a elegir los mejores componentes según tu presupuesto.</p>
                {presupuestoObjetivo && (
                  <p className="mt-2 text-purple-400">
                    Presupuesto objetivo: ${presupuestoObjetivo.toLocaleString()}
                  </p>
                )}
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-purple-700 text-white'
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-purple-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 