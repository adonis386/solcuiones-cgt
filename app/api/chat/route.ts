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

export async function POST(request: Request) {
  try {
    const { message, presupuesto, history } = await request.json();

    // Preparar el historial de la conversación
    const chatHistory = history?.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    })) || [];

    // Crear el contexto de la conversación
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
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
      ? `[Presupuesto del usuario: $${presupuesto.toLocaleString()}]\n\n${message}`
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
      error: 'Error al procesar el mensaje. Por favor, verifica que la API key de Gemini esté configurada correctamente.'
    }, { status: 500 });
  }
} 