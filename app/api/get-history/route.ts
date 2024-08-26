import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Ordenar os itens do histórico por nome do produto
    const result = await query('SELECT * FROM shopping_history ORDER BY produto');
    return NextResponse.json(result.rows, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
    }});
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao carregar histórico', error }, { status: 500 });
  }
}
