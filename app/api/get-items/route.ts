import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM shopping_items ORDER BY categoria, produto');
    return NextResponse.json(result.rows, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
    }});
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao carregar itens', error }, { status: 500 });
  }
}
