import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface Componente extends RowDataPacket {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria_id: number;
  categoria_nombre: string;
}

// Función para obtener componentes de la base de datos
async function getComponentesFromDB(): Promise<Componente[]> {
  try {
    const [rows] = await pool.query<Componente[]>(`
      SELECT c.*, cat.nombre as categoria_nombre 
      FROM componentes c
      JOIN categorias cat ON c.categoria_id = cat.id
    `);
    return rows;
  } catch (error) {
    console.error('Error al obtener componentes:', error);
    return [];
  }
}

// Prompt del sistema
const systemPrompt = `Eres un experto asesor en ensamblaje de PCs. Tu objetivo es ayudar a los usuarios a seleccionar los componentes más adecuados para su PC según sus necesidades y presupuesto.

Instrucciones:
1. Pregunta al usuario sobre su presupuesto y el uso que le dará a la PC
2. Recomienda componentes basándote en los componentes disponibles en la base de datos
3. Explica por qué recomiendas cada componente
4. Mantén un tono amigable y profesional
5. Si no hay componentes disponibles en alguna categoría, indícalo claramente

Recuerda que debes recomendar componentes que:
- Sean compatibles entre sí
- Se ajusten al presupuesto del usuario
- Sean adecuados para el uso que le dará a la PC
- Estén disponibles en la base de datos

Los componentes disponibles son:`;

// Función para obtener respuesta del chatbot
export async function getChatbotResponse(
  userMessage: string,
  chatHistory: { role: string; content: string }[]
): Promise<string> {
  try {
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
      maxTokens: 500,
    });

    const messages = [
      new SystemMessage(systemPrompt),
      ...chatHistory.map(msg => 
        msg.role === "user" 
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      ),
      new HumanMessage(userMessage)
    ];

    const response = await model.invoke(messages);
    return response.content.toString();
  } catch (error: unknown) {
    console.error("Error en el chatbot:", error);
    return "Lo siento, hubo un error al procesar tu mensaje.";
  }
} 