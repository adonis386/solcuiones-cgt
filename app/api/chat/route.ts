import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Validar API key
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('GOOGLE_API_KEY no está configurada en las variables de entorno');
}

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const SYSTEM_PROMPT = `Eres un experto en computadoras y hardware, especializado en ayudar a las personas a armar sus PCs. 
Tu objetivo es guiar al usuario de manera natural y profesional, entendiendo sus necesidades y proporcionando recomendaciones técnicas precisas.

Características clave:
- Eres un experto en hardware de PC con conocimiento profundo de componentes actuales
- Proporcionas recomendaciones técnicas basadas en casos de uso reales
- Mantienes un tono profesional pero accesible
- Te enfocas en entender las necesidades del usuario antes de dar recomendaciones
- Consideras la compatibilidad entre componentes
- Estás al día con las últimas tecnologías y precios del mercado

Cuando el usuario te pregunte, responde de manera natural y conversacional, como lo haría un experto en una tienda de computadoras.`;

interface Componente {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria_id: number;
  imagen_url: string;
  categoria_nombre: string;
}

export async function POST(request: Request) {
  try {
    const { message, presupuesto, history, componentes } = await request.json();

    // Formatear los datos de los componentes para el contexto del modelo
    let inventoryContext = "Inventario de componentes disponibles:\n\n";
    for (const categoryId in componentes) {
      if (componentes.hasOwnProperty(categoryId)) {
        const categoryComponents = componentes[categoryId];
        if (categoryComponents.length > 0) {
          // Asumir que el primer componente tiene el nombre de la categoría
          inventoryContext += `Categoría: ${categoryComponents[0].categoria_nombre}\n`;
          categoryComponents.forEach((comp: Componente) => {
            inventoryContext += `- ${comp.nombre} ($${comp.precio})\n  Descripción: ${comp.descripcion}\n`;
          });
          inventoryContext += '\n'; // Agregar una línea en blanco entre categorías
        }
      }
    }

    // Preparar el historial de la conversación, incluyendo el inventario como primer mensaje de contexto
    const chatHistory = history?.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    })) || [];

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'user', parts: [{ text: inventoryContext }] }, // Incluir el inventario como contexto
        ...chatHistory
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    // Preparar el mensaje con el contexto del presupuesto
    const userMessage = presupuesto 
      ? `[Presupuesto del usuario: $${presupuesto.toLocaleString()}]

${message}`
      : message;

    // Obtener respuesta de Gemini
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      message: text
    });

  } catch (error) {
    console.error('Error en el chat:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al procesar el mensaje.'
    }, { status: 500 });
  }
} 