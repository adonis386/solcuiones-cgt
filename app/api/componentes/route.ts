import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, cat.nombre as categoria_nombre 
      FROM componentes c
      JOIN categorias cat ON c.categoria_id = cat.id
      ORDER BY c.nombre
    `);
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener componentes:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener componentes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, descripcion, precio, categoria_id, imagen_url } = await request.json();

    if (!nombre || !descripcion || !precio || !categoria_id) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son requeridos excepto la imagen' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      'INSERT INTO componentes (nombre, descripcion, precio, categoria_id, imagen_url) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, categoria_id, imagen_url || null]
    );

    return NextResponse.json({ 
      success: true, 
      data: { 
        id: result.insertId, 
        nombre, 
        descripcion, 
        precio, 
        categoria_id, 
        imagen_url 
      } 
    });
  } catch (error) {
    console.error('Error al crear componente:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear el componente' },
      { status: 500 }
    );
  }
} 