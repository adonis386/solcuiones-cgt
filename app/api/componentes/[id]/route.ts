import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, cat.nombre as categoria_nombre 
       FROM componentes c
       JOIN categorias cat ON c.categoria_id = cat.id
       WHERE c.id = ?`,
      [params.id]
    );

    if (!rows[0]) {
      return NextResponse.json(
        { success: false, error: 'Componente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al obtener componente:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener el componente' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { nombre, descripcion, precio, categoria_id, imagen_url } = await request.json();

    if (!nombre || !descripcion || !precio || !categoria_id) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son requeridos excepto la imagen' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      'UPDATE componentes SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ?, imagen_url = ? WHERE id = ?',
      [nombre, descripcion, precio, categoria_id, imagen_url || null, params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Componente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: { 
        id: params.id, 
        nombre, 
        descripcion, 
        precio, 
        categoria_id, 
        imagen_url 
      } 
    });
  } catch (error) {
    console.error('Error al actualizar componente:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar el componente' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await pool.query('DELETE FROM componentes WHERE id = ?', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar componente:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar el componente' },
      { status: 500 }
    );
  }
} 