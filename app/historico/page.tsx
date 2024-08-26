"use client"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { ShoppingItem, HistoryItem } from '@/types'

const HistoryPage: React.FC = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);

    useEffect(() => {
        async function fetchData() {
            const historyResponse = await fetch('/api/get-history');
            const historyData = await historyResponse.json();
            setHistory(historyData);

            const shoppingResponse = await fetch('/api/get-items');
            const shoppingData = await shoppingResponse.json();
            setShoppingList(shoppingData);
        }
        fetchData();
    }, []);

    const handleReturnToShoppingList = async (id: number) => {
        const itemToReturn = history.find(item => item.id === id);
        if (itemToReturn) {

            const newItem: ShoppingItem = {
                id: itemToReturn.id,
                produto: itemToReturn.produto,
                categoria: itemToReturn.categoria,
                bought: false
            };

            const updatedShoppingList = [...shoppingList, newItem];
            setShoppingList(updatedShoppingList);

            // Atualizar o banco de dados
            await fetch('/api/return-to-shopping', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, produto: itemToReturn.produto, categoria: itemToReturn.categoria }),
            });

            // Remover o item do histórico
            const updatedHistory = history.filter(item => item.id !== id);
            setHistory(updatedHistory);
        }
    };

    const handleDeleteFromHistory = async (id: number) => {
        // Remover o item do histórico no banco de dados
        await fetch(`/api/delete-from-history/${id}`, {
            method: 'DELETE',
        });

        // Atualizar o estado local
        const updatedHistory = history.filter(item => item.id !== id);
        setHistory(updatedHistory);
    };

    return (
        <div className="flex flex-col items-center justify-center p-2 text-sm">
            {history.length > 0 ? (
                <table className="bg-gray-100 rounded-md min-w-96">
                    <tbody>
                        {history.map((item) => (
                            <tr key={item.id} className="">
                                <td className="p-2">{item.produto}</td>
                                <td className="flex items-center justify-center">
                                    <Button
                                        onClick={() => handleReturnToShoppingList(item.id)}
                                        variant='default'
                                        className='bg-blue-500 text-xs px-2 m-1'
                                    >
                                        Recomprar
                                    </Button>
                                    <Button
                                        onClick={() => handleDeleteFromHistory(item.id)}
                                        variant="destructive"
                                        className='text-xs px-2'
                                    >
                                        Apagar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Não há itens no histórico.</p>
            )}
        </div>
    );
}

export default HistoryPage;
