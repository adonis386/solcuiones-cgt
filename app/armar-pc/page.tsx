"use client";

import React, { useState, useEffect, useRef } from "react";
import ComponentesModal from "../components/ComponentesModal";
import Image from "next/image";
import { useTheme } from '../components/ThemeProvider';
import ThemeSelector from '../components/ThemeSelector';

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

interface ComponentesEstaticos {
  [key: number]: Componente[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ArmarPC() {
  const { currentTheme } = useTheme();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [componentesSeleccionados, setComponentesSeleccionados] = useState<Record<number, Componente>>({});
  const [presupuestoTotal, setPresupuestoTotal] = useState(0);
  const [presupuestoObjetivo, setPresupuestoObjetivo] = useState<number | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tienePresupuesto, setTienePresupuesto] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Datos estáticos de categorías
  const categorias: Categoria[] = [
    { id: 1, nombre: "Procesadores" },
    { id: 2, nombre: "Tarjetas Gráficas" },
    { id: 3, nombre: "Placas Base" },
    { id: 4, nombre: "Memoria RAM" },
    { id: 5, nombre: "Almacenamiento" },
    { id: 6, nombre: "Fuentes de Poder" },
    { id: 7, nombre: "Gabinetes" },
    { id: 8, nombre: "Refrigeración" }
  ];

  // Datos estáticos de componentes
  const componentesEstaticos: ComponentesEstaticos = {
    1: [ // Procesadores
      {
        id: 1,
        nombre: "AMD Ryzen 5 5600GT",
        descripcion: "Procesador Hexa-Core 3.6GHz, Socket AM4, 19MB caché, 65W TDP, Radeon Graphics",
        precio: 155,
        imagen_url: "/componentes/ryzen-5700x.webp",
        categoria_id: 1,
        categoria_nombre: "Procesadores"
      },
      {
        id: 2,
        nombre: "AMD Ryzen 7 5700X",
        descripcion: "Procesador Octa-Core 3.8GHz, Socket AM4, 16MB caché, 65W TDP",
        precio: 205,
        imagen_url: "/componentes/ryzen-5700x(1).webp",
        categoria_id: 1,
        categoria_nombre: "Procesadores"
      },
      {
        id: 3,
        nombre: "Intel Core i5-12400",
        descripcion: "Procesador 12th Gen 2.5GHz, Socket 1700, 18MB caché, 65W TDP",
        precio: 175,
        imagen_url: "/componentes/i5-12400.webp",
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
        imagen_url: "/componentes/rx-6600-challenger.webp",
        categoria_id: 2,
        categoria_nombre: "Tarjetas Gráficas"
      },
      {
        id: 11,
        nombre: "ASUS GeForce RTX 3060 Dual V2 OC",
        descripcion: "12GB GDDR6, 192-bit, 1867MHz, 650W, HDMI-DP",
        precio: 390,
        imagen_url: "/componentes/rtx-3060-dual.webp",
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
        imagen_url: "/componentes/asus-a520m-k.webp",
        categoria_id: 3,
        categoria_nombre: "Placas Base"
      },
      {
        id: 13,
        nombre: "Gigabyte A520M K V2",
        descripcion: "MATX Socket AM4, 2xDDR4-5100, 4xSATA, M.2, 2xPCIe, HD 7.1, 4xUSB, HDMI-VGA",
        precio: 60,
        imagen_url: "/componentes/gigabyte-a520m-k.webp",
        categoria_id: 3,
        categoria_nombre: "Placas Base"
      },
      {
        id: 14,
        nombre: "ECS B660HT-M22",
        descripcion: "MATX LGA1700, 2xDDR4-4600, 4xSATA, 6xUSB3.2+5xUSB2.0, 2xM.2, UHD, 4xPCIe, HDMI-VGA, Gen 14th-13th-12th",
        precio: 90,
        imagen_url: "/componentes/ecs-b660ht-m22.webp",
        categoria_id: 3,
        categoria_nombre: "Placas Base"
      },
      {
        id: 15,
        nombre: "MSI PRO Z790-A MAX WIFI",
        descripcion: "ATX Socket LGA1700, 4xDDR5-7800, 6xSATA, 4xM.2, 4xPCIe, 14xUSB, HDMI-DP, Gen 14th-13th-12th",
        precio: 285,
        imagen_url: "/componentes/msi-z790-a.webp",
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
        imagen_url: "/componentes/corsair-vengeance-rgb.webp",
        categoria_id: 4,
        categoria_nombre: "Memoria RAM"
      },
      {
        id: 7,
        nombre: "XPG Gammix D30 8GB",
        descripcion: "Memoria DDR4 3200MHz, Con disipador, UDIMM",
        precio: 23,
        imagen_url: "/componentes/xpg-gammix-d30.webp",
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
        imagen_url: "/componentes/xpg-gammix-s60.webp",
        categoria_id: 5,
        categoria_nombre: "Almacenamiento"
      },
      {
        id: 9,
        nombre: "ADATA Legend 710 256GB",
        descripcion: "SSD M.2 2280, PCIe Gen3 x4",
        precio: 24,
        imagen_url: "/componentes/adata-legend-710.webp",
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
        imagen_url: "/componentes/azza-750w.webp",
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
        imagen_url: "/componentes/msi-mag-shield.webp",
        categoria_id: 7,
        categoria_nombre: "Gabinetes"
      },
      {
        id: 17,
        nombre: "Gamemax Gaming Diamond COC",
        descripcion: "Mid Tower, 2xUSB 3.0, 1HD Audio, Fan COC 14cm, ARGB, Lateral Vidrio Temp, Negro",
        precio: 65,
        imagen_url: "/componentes/gamemax-diamond.webp",
        categoria_id: 7,
        categoria_nombre: "Gabinetes"
      },
      {
        id: 18,
        nombre: "Cooler Master HAF500",
        descripcion: "Mid Tower, 2xUSB3.2, Type C, HD Audio, 2xFan 20cm+2xFan 12cm, ARGB, Frontal Mall, Negro",
        precio: 167,
        imagen_url: "/componentes/cooler-master-haf500.webp",
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
        imagen_url: "/componentes/gamemax-gamma-600.webp",
        categoria_id: 8,
        categoria_nombre: "Refrigeración"
      }
    ]
  };

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

  const handleNextComponent = () => {
    if (!categoriaSeleccionada) return;
    
    // Encontrar el índice de la categoría actual
    const currentIndex = categorias.findIndex(cat => cat.id === categoriaSeleccionada.id);
    
    // Si hay una siguiente categoría, seleccionarla
    if (currentIndex < categorias.length - 1) {
      const nextCategoria = categorias[currentIndex + 1];
      setCategoriaSeleccionada(nextCategoria);
    } else {
      // Si es la última categoría, cerrar el modal
      setIsModalOpen(false);
    }
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

  const getWhatsAppMessage = () => {
    if (Object.keys(componentesSeleccionados).length === 0) {
      return "Hola soluciones CGT! Estoy interesado en armar una PC. 🛠️";
    }

    let message = "👋 ¡Hola soluciones CGT! \n\n";
    message += "Quiero armar una PC con la siguiente configuración: \n\n";

    Object.values(componentesSeleccionados).forEach(comp => {
      let icon = '';
      switch (comp.categoria_id) {
        case 1: icon = '🧠'; break; // Procesador
        case 2: icon = '🎮'; break; // Tarjeta Gráfica
        case 3: icon = '🔌'; break; // Placa Base
        case 4: icon = '💾'; break; // Memoria RAM
        case 5: icon = '💽'; break; // Almacenamiento
        case 6: icon = '🔋'; break; // Fuentes de Poder
        case 7: icon = '🏢'; break; // Gabinete
        case 8: icon = '❄️'; break; // Refrigeración
        default: icon = '✨';
      }
      message += `${icon} ${comp.categoria_nombre}: ${comp.nombre} ($${comp.precio})\n`;
    });

    message += `\n💰 Presupuesto total estimado: $${presupuestoTotal.toLocaleString()}`;
    message += `\n\n¡Espero su confirmación y los próximos pasos! 👍`;

    return message;
  };

  const getIconForCategory = (nombre: string) => {
    switch (nombre.toLowerCase()) {
      case 'procesadores':
        return '/assets/icons/cpu.svg';
      case 'tarjetas gráficas':
        return '/assets/icons/gpu.svg';
      case 'placas base':
        return '/assets/icons/gear.svg';
      case 'memoria ram':
        return '/assets/icons/ram.svg';
      case 'almacenamiento':
        return '/assets/icons/ssd.png';
      case 'fuentes de poder':
        return '/assets/icons/power-supply.png';
      case 'gabinetes':
        return '/assets/icons/pc-tower.svg';
      case 'refrigeración':
        return '/assets/icons/cooling-fan.png';
      default:
        return '/assets/icons/gear.svg';
    }
  };

  const handlePresupuestoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setPresupuestoObjetivo('');
    } else {
      const number = parseInt(value.replace(/[^0-9]/g, ''));
      if (!isNaN(number)) {
        setPresupuestoObjetivo(number);
      }
    }
  };

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
          componentes: componentesEstaticos
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
        
        // Manejar sugerencias automáticas de componentes
        if (data.suggestedComponents && data.suggestedComponents.length > 0) {
          const newSelected = { ...componentesSeleccionados };
          
          data.suggestedComponents.forEach((id: number) => {
            // Encontrar el componente en el catálogo
            for (const categoryId in componentesEstaticos) {
              const componente = componentesEstaticos[categoryId].find(comp => comp.id === id);
              if (componente) {
                newSelected[componente.categoria_id] = componente;
                break;
              }
            }
          });
          
          setComponentesSeleccionados(newSelected);
        }
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
    <div className={`min-h-screen flex flex-col items-center bg-gradient-to-br ${currentTheme.primary} dark:${currentTheme.secondary} p-6 pb-32`}>
      <ThemeSelector />
      <div className="w-full max-w-2xl flex justify-between items-center mb-8">
        <a
          href="/"
          className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">Volver al inicio</span>
        </a>
      </div>
      <h2 className={`text-3xl sm:text-4xl font-bold ${currentTheme.text} mt-8 mb-4 text-center animate-fade-in`}>
        Arma tu PC
      </h2>
      <p className={`${currentTheme.text} mb-8 text-center animate-fade-in delay-100`}>
        Selecciona un componente por cada categoría para comenzar a armar tu equipo.
      </p>

      {/* Presupuesto Input */}
      <div className="w-full max-w-md mb-12 animate-fade-in delay-200">
        <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20`}>
          {tienePresupuesto === null ? (
            <div className="space-y-4">
              <label className={`block ${currentTheme.text} mb-2`}>
                ¿Tienes un presupuesto en mente?
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setTienePresupuesto(true)}
                  className="flex-1 bg-purple-700 hover:bg-purple-600 text-white rounded-lg py-2 transition-colors"
                >
                  Sí
                </button>
                <button
                  onClick={() => setTienePresupuesto(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-2 transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          ) : tienePresupuesto ? (
            <div className="space-y-4">
              <label htmlFor="presupuesto" className={`block ${currentTheme.text} mb-2`}>
                ¿Cuál es tu presupuesto?
              </label>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentTheme.text}`}>$</span>
                <input
                  type="text"
                  id="presupuesto"
                  value={presupuestoObjetivo === '' ? '' : presupuestoObjetivo.toLocaleString()}
                  onChange={handlePresupuestoChange}
                  placeholder="Ingresa tu presupuesto"
                  className={`w-full pl-8 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg ${currentTheme.text} placeholder-white/50 focus:outline-none focus:border-white`}
                />
              </div>
              <button
                onClick={() => setTienePresupuesto(null)}
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Cambiar respuesta
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className={`${currentTheme.text}`}>
                No hay problema. Te ayudaremos a encontrar la mejor configuración según tus necesidades.
              </p>
              <button
                onClick={() => setTienePresupuesto(null)}
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Cambiar respuesta
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Categorías */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6 mb-24 animate-fade-in delay-300">
        {categorias.map((cat) => (
          <div
            key={cat.id}
            className={`flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 gap-4 border transition-all cursor-pointer
              ${componentesSeleccionados[cat.id] ? 'border-white' : 'border-white/20 hover:border-white'}`}
            onClick={() => handleCategoriaClick(cat)}
          >
            <div className="w-16 h-16 relative">
              <Image
                src={getIconForCategory(cat.nombre)}
                alt={cat.nombre}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-semibold text-white">{cat.nombre}</span>
            {componentesSeleccionados[cat.id] && (
              <span className="text-sm text-white">
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
        componentes={categoriaSeleccionada ? componentesEstaticos[categoriaSeleccionada.id] || [] : []}
        onNext={handleNextComponent}
      />

      {/* Presupuesto Total */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/20 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-white text-center sm:text-left">
              <span className="text-white/80">Presupuesto Total:</span>
              <span className="ml-2 text-xl font-bold text-white">
                ${presupuestoTotal.toLocaleString()}
              </span>
              {presupuestoObjetivo && (
                <span className={`ml-2 text-sm ${presupuestoTotal > presupuestoObjetivo ? 'text-red-400' : 'text-green-400'}`}>
                  ({((presupuestoTotal - presupuestoObjetivo) / presupuestoObjetivo * 100).toFixed(1)}% {presupuestoTotal > presupuestoObjetivo ? 'sobre' : 'bajo'} el presupuesto)
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="text-white/80 text-center sm:text-left">
                {Object.keys(componentesSeleccionados).length} de {categorias.length} componentes seleccionados
              </div>
              <a
                href={`https://wa.me/584242533942?text=${encodeURIComponent(getWhatsAppMessage())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 w-full sm:w-auto h-12 sm:h-auto px-4 sm:px-4 sm:py-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-sm sm:text-base">
                  <span className="sm:hidden">Contactar</span>
                  <span className="hidden sm:inline">Contactar por WhatsApp</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ChatBot Button/Interface */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        {!isChatBotOpen ? (
          <button
            onClick={() => setIsChatBotOpen(true)}
            className="bg-purple-700 text-white p-4 rounded-full shadow-lg hover:bg-purple-600 transition-colors animate-bounce-slow"
          >
            <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        ) : (
          <div className="bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl w-96 border border-gray-700">
            {/* Header */}
            <div className="bg-purple-700 p-4 rounded-t-xl flex justify-between items-center">
              <h3 className="text-white font-semibold">Asistente Virtual</h3>
              <button
                onClick={() => setIsChatBotOpen(false)}
                className="text-white hover:text-purple-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-300">
                  <p className="font-semibold text-lg mb-2">¡Bienvenido al Asistente de PC!</p>
                  <p className="mb-4">Te ayudaré a elegir los componentes perfectos para tu PC.</p>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-left">
                    <p className="mb-2">¿Para qué tipo de uso necesitas la PC?</p>
                    <ul className="list-disc list-inside text-purple-300 space-y-1">
                      <li>🎮 Gaming</li>
                      <li>💼 Oficina</li>
                      <li>🎨 Diseño</li>
                      <li>💻 Programación</li>
                      <li>📺 Streaming</li>
                    </ul>
                  </div>
                  {presupuestoObjetivo && (
                    <p className="mt-4 text-purple-400">
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
                  placeholder="Escribe tu respuesta aquí..."
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
    </div>
  );
} 