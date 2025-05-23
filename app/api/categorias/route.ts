import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM categorias ORDER BY nombre');
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener categorías' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { nombre } = await request.json();

    if (!nombre) {
      return NextResponse.json(
        { success: false, error: 'El nombre es requerido' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      'INSERT INTO categorias (nombre) VALUES (?)',
      [nombre]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: result.insertId, nombre } 
    });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear la categoría' },
      { status: 500 }
    );
  }
} 