"use server";

import { query } from "@/lib/db";

export async function getItems() {
  const result = await query(
    "SELECT * FROM shopping_items ORDER BY categoria, produto"
  );
  return result.rows;
}

export async function addItem(produto: string, categoria: string) {
  const result = await query(
    "INSERT INTO shopping_items (produto, categoria) VALUES ($1, $2) RETURNING *",
    [produto, categoria]
  );
  return result.rows[0];
}

export async function updateItem(id: number, bought: boolean) {
  await query("UPDATE shopping_items SET bought = $1 WHERE id = $2", [
    bought,
    id,
  ]);
}

export async function getHistory() {
  const result = await query("SELECT * FROM shopping_history ORDER BY produto");
  return result.rows;
}

export async function deleteFromHistory(id: number) {
  const result = await query("DELETE FROM shopping_history WHERE id = $1", [
    id,
  ]);
  return result.rows;
}

export async function moveToHistory(boughtItemIds: number[]) {
  await query("BEGIN");
  try {
    for (const id of boughtItemIds) {
      const { rows } = await query(
        "SELECT produto, categoria FROM shopping_items WHERE id = $1",
        [id]
      );
      const { produto, categoria } = rows[0];
      // Remover da lista de compras
      await query("DELETE FROM shopping_items WHERE id = $1", [id]);
      // Inserir no histórico
      await query(
        "INSERT INTO shopping_history (produto, categoria) VALUES ($1, $2)",
        [produto, categoria]
      );
    }
    await query("COMMIT");
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
}

export async function returnToShopping(id: number) {
  try {
    await query("BEGIN");
    const { rows } = await query(
      "SELECT produto, categoria FROM shopping_history WHERE id = $1",
      [id]
    );
    const { produto, categoria } = rows[0];
    // Inserir o item de volta na lista de compras
    await query(
      "INSERT INTO shopping_items (produto, categoria, bought) VALUES ($1, $2, $3)",
      [produto, categoria, false]
    );
    // Remover o item do histórico
    await query("DELETE FROM shopping_history WHERE id = $1", [id]);
    await query("COMMIT");
    return { message: "Item retornado para a lista de compras" };
  } catch (error) {
    await query("ROLLBACK");
    console.error("Erro ao retornar item para a lista de compras:", error);
    throw new Error("Erro ao retornar item para a lista de compras");
  }
}
