import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, cat.nombre as categoria_nombre 
      FROM componentes c
      JOIN categorias cat ON c.categoria_id = cat.id
      WHERE c.categoria_id = ?
      ORDER BY c.nombre
    `, [params.id]);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener componentes por categoría:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener componentes' },
      { status: 500 }
    );
  }
} 