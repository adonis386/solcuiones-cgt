import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM categorias');
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    return NextResponse.json({ success: false, error: 'Error al conectar con la base de datos' }, { status: 500 });
  }
} 