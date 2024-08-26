import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  const boughtItems = await request.json();
  try {
    await query('BEGIN');

    for (const item of boughtItems) {
      await query(
        'DELETE FROM shopping_items WHERE id = $1',
        [item.id]
      );
      await query(
        'INSERT INTO shopping_history (produto, categoria) VALUES ($1, $2)',
        [item.produto, item.categoria]
      );
    }

    await query('COMMIT');
    return NextResponse.json({ message: 'Itens movidos para o histórico' });
  } catch (error) {
    await query('ROLLBACK');
    return NextResponse.json({ message: 'Erro ao mover itens para o histórico', error }, { status: 500 });
  }
}
