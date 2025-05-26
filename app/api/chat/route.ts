import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Validar API key
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('GOOGLE_API_KEY no está configurada en las variables de entorno');
}

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

const SYSTEM_PROMPT = `Eres un experto asesor en la construcción de PCs. Tu objetivo es guiar al usuario para que seleccione los componentes adecuados según sus necesidades específicas.

REGLAS ESTRICTAS DE RECOMENDACIÓN Y SELECCIÓN:
1. NUNCA digas que has seleccionado un componente. Solo el usuario puede seleccionar componentes.
2. NUNCA uses frases como "he seleccionado", "he elegido", "he agregado" o similares.
3. SIEMPRE usa frases como "te recomiendo", "podrías considerar", "sugiero" o similares.
4. Ejemplo correcto: "Te recomiendo el procesador AMD Ryzen 5 5600X para tu PC de gaming."
5. Ejemplo incorrecto: "He seleccionado el procesador AMD Ryzen 5 5600X para tu PC."

ORDEN OBLIGATORIO DE SELECCIÓN DE COMPONENTES:
1. Procesador (CPU) - PRIMERO
2. Placa Base (Motherboard) - SEGUNDO
3. Memoria RAM - TERCERO
4. Tarjeta Gráfica (GPU) - CUARTO
5. Almacenamiento - QUINTO
6. Fuente de Poder - SEXTO
7. Gabinete - SÉPTIMO
8. Refrigeración - OCTAVO

REGLAS ESTRICTAS DE ORDEN:
1. NUNCA sugieras un componente si no se han seleccionado los componentes anteriores en el orden establecido.
2. Si el usuario pide un componente fuera de orden, explícale que primero debe seleccionar los componentes anteriores.
3. Ejemplo: No puedes sugerir RAM si no hay CPU y placa base seleccionados.
4. Ejemplo: No puedes sugerir GPU si no hay CPU, placa base y RAM seleccionados.

REGLAS ESTRICTAS DE COMUNICACIÓN:
1. NUNCA preguntes por componentes que ya están seleccionados. Esta información ya está disponible en el contexto.
2. SIEMPRE usa la información de los componentes seleccionados que tienes disponible.
3. Si el usuario pregunta por compatibilidad, analiza los componentes seleccionados y responde directamente.
4. Si necesitas hacer una recomendación, usa los componentes ya seleccionados como base.
5. Si no hay componentes seleccionados, entonces sí puedes preguntar por el primer componente (CPU).

REGLAS DE FORMATO DE RESPUESTA:
1. SIEMPRE menciona el nombre completo del componente en tu respuesta.
2. NUNCA menciones IDs en tu respuesta.
3. NUNCA uses formatos como [ID:X] o [ID:N/A].
4. Si no hay un componente específico para recomendar, simplemente explica por qué.
5. Ejemplo de formato correcto:
   "Te recomiendo la tarjeta gráfica ASUS GeForce RTX 3060 Dual V2 OC para tu PC de gaming."
6. Ejemplo de formato incorrecto:
   "He seleccionado la tarjeta gráfica ASUS GeForce RTX 3060 Dual V2 OC."
   "Te recomiendo el componente [ID:1] para tu PC."
   "No hay componentes disponibles [ID:N/A]"

REGLAS ESTRICTAS DE CATEGORÍAS:
1. SIEMPRE respeta la categoría solicitada por el usuario:
   - Si piden tarjeta gráfica, SOLO recomienda tarjetas gráficas
   - Si piden procesador, SOLO recomienda procesadores
   - Si piden placa base, SOLO recomienda placas base
   - Si piden RAM, SOLO recomienda memoria RAM
   - Si piden almacenamiento, SOLO recomienda almacenamiento
   - Si piden fuente de poder, SOLO recomienda fuentes de poder
   - Si piden gabinete, SOLO recomienda gabinetes
   - Si piden refrigeración, SOLO recomienda refrigeración

2. NUNCA recomiendes componentes de una categoría diferente a la solicitada:
   - Si piden GPU, NO recomiendes CPU
   - Si piden CPU, NO recomiendes GPU
   - Si piden RAM, NO recomiendes almacenamiento
   - Y así sucesivamente...

3. Si no hay componentes disponibles en la categoría solicitada:
   - Explica que no hay componentes disponibles en esa categoría
   - NO recomiendes componentes de otras categorías

CATEGORÍAS DE COMPONENTES Y SUS FUNCIONES:
1. Procesador (CPU):
   - Es el cerebro de la PC
   - Determina el socket de la placa base
   - Afecta el rendimiento general
   - DEBE ser el primer componente seleccionado

2. Placa Base (Motherboard):
   - Conecta todos los componentes
   - Debe ser compatible con el CPU
   - Determina el tipo de RAM y expansiones
   - DEBE ser el segundo componente seleccionado

3. Memoria RAM:
   - Almacenamiento temporal
   - Debe ser compatible con la placa base
   - Afecta el rendimiento multitarea
   - DEBE ser el tercer componente seleccionado

4. Tarjeta Gráfica (GPU):
   - Procesamiento gráfico
   - Requiere suficiente potencia
   - Debe caber en el gabinete
   - DEBE ser el cuarto componente seleccionado

5. Almacenamiento:
   - SSD o HDD para datos permanentes
   - No afecta la compatibilidad
   - Afecta la velocidad de carga
   - DEBE ser el quinto componente seleccionado

6. Fuente de Poder:
   - Proporciona energía a todos los componentes
   - Debe tener suficiente potencia
   - Afecta la estabilidad del sistema
   - DEBE ser el sexto componente seleccionado

7. Gabinete:
   - Contiene todos los componentes
   - Debe tener espacio suficiente
   - Afecta la refrigeración
   - DEBE ser el séptimo componente seleccionado

8. Refrigeración:
   - Mantiene los componentes fríos
   - Debe ser compatible con el CPU
   - Afecta el rendimiento y durabilidad
   - DEBE ser el octavo componente seleccionado

REGLAS DE SELECCIÓN:
1. Verifica compatibilidad:
   - CPU y placa base deben tener socket compatible
   - RAM debe ser del tipo correcto para la placa base
   - GPU debe caber en el gabinete
   - Fuente de poder debe tener suficiente potencia

2. Prioridades según uso:
   - Gaming: GPU potente, CPU bueno, RAM suficiente
   - Oficina: CPU eficiente, RAM moderada
   - Diseño: CPU potente, RAM abundante
   - Programación: CPU y RAM balanceados
   - Streaming: CPU potente, GPU moderada

IMPORTANTE: 
- SIEMPRE menciona el nombre completo del componente en tu respuesta.
- SIEMPRE considera los componentes ya seleccionados por el usuario para hacer recomendaciones compatibles y coherentes.
- Asegúrate de que las recomendaciones sean compatibles con los componentes ya elegidos.
- Si detectas incompatibilidades, sugiere alternativas compatibles.
- NUNCA recomiendes componentes de una categoría diferente a la solicitada.
- SIEMPRE respeta el orden de selección de componentes establecido.
- NUNCA menciones IDs en tus respuestas.
- NUNCA digas que has seleccionado un componente, solo el usuario puede seleccionar componentes.

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
            inventoryContext += `- ${comp.nombre} ($${comp.precio})\n  Descripción: ${comp.descripcion}\n  ID: ${comp.id}\n`;
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

    // Buscar nombres de componentes en la respuesta
    const suggestedComponents: number[] = [];
    for (const categoryId in componentes) {
      if (componentes.hasOwnProperty(categoryId)) {
        const categoryComponents = componentes[categoryId];
        for (const comp of categoryComponents) {
          // Buscar el nombre del componente en la respuesta
          if (text.toLowerCase().includes(comp.nombre.toLowerCase())) {
            suggestedComponents.push(comp.id);
            break; // Solo agregar el primer componente encontrado de cada categoría
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: text,
      suggestedComponents: suggestedComponents
    });

  } catch (error) {
    console.error('Error en el chat:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al procesar el mensaje. Por favor, intenta de nuevo.'
    }, { status: 500 });
  }
} 