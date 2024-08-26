import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  const { id, produto, categoria } = await request.json();
  try {
    // Iniciar a transação
    await query('BEGIN');

    // Inserir o item de volta na lista de compras
    await query(
      'INSERT INTO shopping_items (produto, categoria, bought) VALUES ($1, $2, $3)',
      [produto, categoria, false]
    );

    // Remover o item do histórico
    await query('DELETE FROM shopping_history WHERE id = $1', [id]);

    // Comitar a transação
    await query('COMMIT');

    return NextResponse.json({ message: 'Item retornado para a lista de compras' });
  } catch (error) {
    // Reverter a transação em caso de erro
    await query('ROLLBACK');
    return NextResponse.json({ message: 'Erro ao retornar item para a lista de compras', error }, { status: 500 });
  }
}
