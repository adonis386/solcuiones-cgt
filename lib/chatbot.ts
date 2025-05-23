import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

interface Componente {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria_id: number;
  categoria_nombre: string;
}

interface ComponenteResumen {
  nombre: string;
  descripcion: string;
  precio: number;
}

// Configuración del modelo
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY,
});

// Función para obtener componentes (datos estáticos)
async function getComponentesFromDB(): Promise<Componente[]> {
  return [
    {
      id: 1,
      nombre: "Procesador Intel i5",
      descripcion: "Procesador de 6 núcleos y 12 hilos",
      precio: 299.99,
      categoria_id: 1,
      categoria_nombre: "Procesadores"
    },
    {
      id: 2,
      nombre: "Tarjeta Gráfica RTX 3060",
      descripcion: "Tarjeta gráfica de gama media-alta",
      precio: 399.99,
      categoria_id: 2,
      categoria_nombre: "Tarjetas Gráficas"
    }
  ];
}

// Prompt del sistema
const systemPrompt = `Eres un experto asesor en ensamblaje de PCs. Tu objetivo es ayudar a los usuarios a seleccionar los componentes más adecuados para su PC según sus necesidades y presupuesto.

Instrucciones:
1. Pregunta al usuario sobre su presupuesto y el uso que le dará a la PC
2. Recomienda componentes basándote en los componentes disponibles
3. Explica por qué recomiendas cada componente
4. Mantén un tono amigable y profesional
5. Si no hay componentes disponibles en alguna categoría, indícalo claramente

Recuerda que debes recomendar componentes que:
- Sean compatibles entre sí
- Se ajusten al presupuesto del usuario
- Sean adecuados para el uso que le dará a la PC

Los componentes disponibles son:`;

// Función para obtener respuesta del chatbot
export async function getChatbotResponse(message: string, history: { role: string; content: string }[] = []) {
  try {
    // Obtener componentes
    const componentes = await getComponentesFromDB();
    
    // Organizar componentes por categoría
    const componentesPorCategoria = componentes.reduce((acc: Record<string, ComponenteResumen[]>, comp) => {
      if (!acc[comp.categoria_nombre]) {
        acc[comp.categoria_nombre] = [];
      }
      acc[comp.categoria_nombre].push({
        nombre: comp.nombre,
        descripcion: comp.descripcion,
        precio: comp.precio
      });
      return acc;
    }, {});

    // Crear resumen de componentes disponibles
    const resumenComponentes = Object.entries(componentesPorCategoria)
      .map(([categoria, comps]) => `${categoria}:\n${comps.map(c => `- ${c.nombre}: ${c.descripcion} ($${c.precio})`).join('\n')}`)
      .join('\n\n');

    // Preparar mensajes para el modelo
    const messages = [
      { role: "system", content: `${systemPrompt}\n\n${resumenComponentes}` },
      ...history,
      { role: "user", content: message }
    ];

    // Obtener respuesta del modelo
    const response = await model.invoke(messages);
    return response.content;
  } catch (error) {
    console.error('Error al obtener respuesta del chatbot:', error);
    throw error;
  }
} 