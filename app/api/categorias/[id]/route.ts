import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

type RouteContext = {
  params: {
    id: string;
  };
};

interface CountResult extends RowDataPacket {
  count: number;
}

interface Categoria extends RowDataPacket {
  id: number;
  nombre: string;
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Primero verificar si hay componentes asociados
    const [componentes] = await pool.query<CountResult[]>(
      'SELECT COUNT(*) as count FROM componentes WHERE categoria_id = ?',
      [context.params.id]
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
    await pool.query('DELETE FROM categorias WHERE id = ?', [context.params.id]);
    
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
  context: RouteContext
) {
  try {
    const [rows] = await pool.query<Categoria[]>(
      'SELECT * FROM categorias WHERE id = ?',
      [context.params.id]
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
  context: RouteContext
) {
  try {
    const { nombre } = await request.json();

    if (!nombre) {
      return NextResponse.json(
        { success: false, error: 'El nombre es requerido' },
        { status: 400 }
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE categorias SET nombre = ? WHERE id = ?',
      [nombre, context.params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: { id: context.params.id, nombre } 
    });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la categoría' },
      { status: 500 }
    );
  }
} 