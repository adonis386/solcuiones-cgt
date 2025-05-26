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

REGLAS ESTRICTAS DE COMUNICACIÓN:
1. NUNCA preguntes por componentes que ya están seleccionados. Esta información ya está disponible en el contexto.
2. SIEMPRE usa la información de los componentes seleccionados que tienes disponible.
3. Si el usuario pregunta por compatibilidad, analiza los componentes seleccionados y responde directamente.
4. Si necesitas hacer una recomendación, usa los componentes ya seleccionados como base.
5. Si no hay componentes seleccionados, entonces sí puedes preguntar por el primer componente.

CATEGORÍAS DE COMPONENTES Y SUS FUNCIONES:
1. Procesador (CPU):
   - Es el cerebro de la PC
   - Determina el socket de la placa base
   - Afecta el rendimiento general

2. Placa Base (Motherboard):
   - Conecta todos los componentes
   - Debe ser compatible con el CPU
   - Determina el tipo de RAM y expansiones

3. Memoria RAM:
   - Almacenamiento temporal
   - Debe ser compatible con la placa base
   - Afecta el rendimiento multitarea

4. Almacenamiento:
   - SSD o HDD para datos permanentes
   - No afecta la compatibilidad
   - Afecta la velocidad de carga

5. Tarjeta Gráfica (GPU):
   - Procesamiento gráfico
   - Requiere suficiente potencia
   - Debe caber en el gabinete

6. Fuente de Poder:
   - Proporciona energía a todos los componentes
   - Debe tener suficiente potencia
   - Afecta la estabilidad del sistema

7. Gabinete:
   - Contiene todos los componentes
   - Debe tener espacio suficiente
   - Afecta la refrigeración

REGLAS DE SELECCIÓN:
1. SIEMPRE respeta la categoría solicitada:
   - Si piden placa base, recomienda SOLO placas base
   - Si piden fuente de poder, recomienda SOLO fuentes de poder
   - Si piden almacenamiento, recomienda SOLO almacenamiento

2. Verifica compatibilidad:
   - CPU y placa base deben tener socket compatible
   - RAM debe ser del tipo correcto para la placa base
   - GPU debe caber en el gabinete
   - Fuente de poder debe tener suficiente potencia

3. Prioridades según uso:
   - Gaming: GPU potente, CPU bueno, RAM suficiente
   - Oficina: CPU eficiente, RAM moderada
   - Diseño: CPU potente, RAM abundante
   - Programación: CPU y RAM balanceados
   - Streaming: CPU potente, GPU moderada

IMPORTANTE: 
- Cuando sugieras componentes, DEBES incluir el ID del componente en tu respuesta usando el formato [ID:X] donde X es el número del ID del componente, pero NO menciones el ID en el texto de tu respuesta.
- SIEMPRE considera los componentes ya seleccionados por el usuario para hacer recomendaciones compatibles y coherentes.
- Asegúrate de que las recomendaciones sean compatibles con los componentes ya elegidos.
- Si detectas incompatibilidades, sugiere alternativas compatibles.

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

interface SelectedComponent extends Componente {
  categoria_nombre: string;
}

export async function POST(request: Request) {
  try {
    const { message, presupuesto, history, componentes, selectedComponents } = await request.json();

    // Formatear los datos de los componentes para el contexto del modelo
    let inventoryContext = "";

    // Primero agregar los componentes seleccionados
    if (selectedComponents && Object.keys(selectedComponents).length > 0) {
      inventoryContext += "COMPONENTES SELECCIONADOS POR EL USUARIO:\n";
      for (const categoryId in selectedComponents) {
        const comp = selectedComponents[categoryId] as SelectedComponent;
        if (comp) {
          inventoryContext += `- ${comp.nombre} (${comp.categoria_nombre})\n`;
          if (comp.descripcion) {
            inventoryContext += `  Especificaciones: ${comp.descripcion}\n`;
          }
        }
      }
      inventoryContext += "\n";
    }

    // Luego agregar el inventario disponible
    inventoryContext += "INVENTARIO DE COMPONENTES DISPONIBLES:\n\n";
    for (const categoryId in componentes) {
      if (componentes.hasOwnProperty(categoryId)) {
        const categoryComponents = componentes[categoryId];
        if (categoryComponents.length > 0) {
          inventoryContext += `Categoría: ${categoryComponents[0].categoria_nombre}\n`;
          categoryComponents.forEach((comp: Componente) => {
            inventoryContext += `- ${comp.nombre} ($${comp.precio})\n  Descripción: ${comp.descripcion}\n`;
          });
          inventoryContext += '\n';
        }
      }
    }

    // Preparar el historial de la conversación
    const chatHistory = history?.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    })) || [];

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'user', parts: [{ text: inventoryContext }] },
        ...chatHistory
      ],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    // Preparar el mensaje con el contexto del presupuesto y componentes seleccionados
    let userMessage = message;
    if (presupuesto) {
      userMessage = `[Presupuesto del usuario: $${presupuesto.toLocaleString()}]\n\n${message}`;
    }
    if (selectedComponents && Object.keys(selectedComponents).length > 0) {
      userMessage = `[Componentes seleccionados: ${Object.values(selectedComponents as Record<string, Componente>).map(comp => comp.nombre).join(', ')}]\n\n${userMessage}`;
    }

    // Obtener respuesta de Gemini
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    // Verificar si la respuesta está completa
    if (!text || text.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'La respuesta del asistente está vacía. Por favor, intenta de nuevo.'
      }, { status: 500 });
    }

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
      error: 'Error al procesar el mensaje. Por favor, intenta de nuevo.'
    }, { status: 500 });
  }
} 