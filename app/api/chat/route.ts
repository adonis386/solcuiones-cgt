import { NextResponse } from 'next/server';
import { getChatbotResponse } from '@/lib/chatbot';

export async function POST(request: Request) {
  try {
    const { message, chatHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'El mensaje es requerido' },
        { status: 400 }
      );
    }

    const response = await getChatbotResponse(message, chatHistory || []);

    return NextResponse.json({ 
      success: true, 
      data: { 
        message: response 
      } 
    });
  } catch (error) {
    console.error('Error en el endpoint de chat:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar el mensaje' },
      { status: 500 }
    );
  }
} 