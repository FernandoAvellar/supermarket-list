import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  const { produto, categoria } = await request.json();
  try {
    const result = await query(
      'INSERT INTO shopping_items (produto, categoria) VALUES ($1, $2) RETURNING *',
      [produto, categoria]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao inserir item', error }, { status: 500 });
  }
}
