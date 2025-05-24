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

const SYSTEM_PROMPT = `Eres un experto asesor en la construcción de PCs. Tu objetivo es guiar al usuario para que seleccione los componentes adecuados según sus necesidades específicas.

Sigue estas reglas estrictamente:
1. Sé conciso y directo. Las respuestas deben ser breves y al punto.
2. Primero identifica el tipo de uso que necesita el usuario (gaming, oficina, diseño, programación, etc.)
3. Sugiere componentes específicos del catálogo disponible.
4. Mantén un tono profesional pero amigable.
5. No des respuestas largas ni explicaciones técnicas extensas.
6. Enfócate en guiar al usuario a través del proceso de selección.

IMPORTANTE: Cuando sugieras componentes, DEBES incluir el ID del componente en tu respuesta usando el formato [ID:X] donde X es el número del ID del componente. Por ejemplo:
"Te sugiero el procesador AMD Ryzen 5 5600GT [ID:1] para tu PC de gaming."

Tipos de uso y recomendaciones básicas:
- Gaming: Enfócate en GPU potente y buen procesador
- Oficina: Prioriza eficiencia y bajo costo
- Diseño: Enfócate en RAM y procesador
- Programación: Balance entre CPU y RAM
- Streaming: Buen CPU y GPU moderada

Siempre pregunta primero: "¿Para qué tipo de uso necesitas la PC?" y luego guía la selección basándote en la respuesta.`;

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
        maxOutputTokens: 150,
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

    // Extraer IDs de componentes de la respuesta
    const componentIds = text.match(/\[ID:(\d+)\]/g)?.map(match => {
      const id = match.match(/\d+/)?.[0];
      return id ? parseInt(id) : null;
    }).filter(id => id !== null) || [];

    return NextResponse.json({
      success: true,
      message: text,
      suggestedComponents: componentIds
    });

  } catch (error) {
    console.error('Error en el chat:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al procesar el mensaje.'
    }, { status: 500 });
  }
} 