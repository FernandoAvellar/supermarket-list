import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { bought } = await request.json();
  try {
    const result = await query(
      'UPDATE shopping_items SET bought = $1 WHERE id = $2 RETURNING *',
      [bought, params.id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao atualizar item', error }, { status: 500 });
  }
}
