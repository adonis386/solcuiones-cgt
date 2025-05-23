import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Primero verificar si hay componentes asociados
    const [componentes] = await pool.query(
      'SELECT COUNT(*) as count FROM componentes WHERE categoria_id = ?',
      [params.id]
    );

    if (componentes[0].count > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No se puede eliminar la categoría porque tiene componentes asociados' 
        },
        { status: 400 }
      );
    }

    // Si no hay componentes asociados, eliminar la categoría
    await pool.query('DELETE FROM categorias WHERE id = ?', [params.id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar la categoría' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM categorias WHERE id = ?',
      [params.id]
    );

    if (!rows[0]) {
      return NextResponse.json(
        { success: false, error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener la categoría' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { nombre } = await request.json();

    if (!nombre) {
      return NextResponse.json(
        { success: false, error: 'El nombre es requerido' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      'UPDATE categorias SET nombre = ? WHERE id = ?',
      [nombre, params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: { id: params.id, nombre } 
    });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la categoría' },
      { status: 500 }
    );
  }
} 