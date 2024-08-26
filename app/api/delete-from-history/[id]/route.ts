import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await query('DELETE FROM shopping_history WHERE id = $1', [params.id]);
    return NextResponse.json({ message: 'Item deletado do histórico' });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao deletar item do histórico', error }, { status: 500 });
  }
}
