import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  const boughtItemIds: number[] = await request.json();
  
  try {
    await query('BEGIN');

    for (const id of boughtItemIds) {
      const { rows } = await query('SELECT produto, categoria FROM shopping_items WHERE id = $1', [id]);

      if (rows.length === 0) {
        throw new Error(`Item com ID ${id} não encontrado na lista de compras`);
      }

      const { produto, categoria } = rows[0];

      // Remover o item da lista de compras
      await query('DELETE FROM shopping_items WHERE id = $1', [id]);

      // Inserir o item no histórico
      await query('INSERT INTO shopping_history (produto, categoria) VALUES ($1, $2)', [produto, categoria]);
    }

    await query('COMMIT');
    return NextResponse.json({ message: 'Itens movidos para o histórico' });
  } catch (error) {
    await query('ROLLBACK');
    return NextResponse.json({ message: 'Erro ao mover itens para o histórico', error: (error as Error).message }, { status: 500 });
  }
}
