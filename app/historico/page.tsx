"use client"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"

const HistoryPage = () => {
    const [history, setHistory] = useState<{ id: number; produto: string; categoria: string }[]>([]);
    const [shoppingList, setShoppingList] = useState<{ id: number; produto: string; categoria: string; bought: boolean }[]>([]);

    useEffect(() => {
        // Load history from localStorage when the component mounts
        const existingHistory = localStorage.getItem('shoppingHistory');
        if (existingHistory) {
            setHistory(JSON.parse(existingHistory));
        }

        // Load shopping list from localStorage
        const existingShoppingList = localStorage.getItem('shoppingList');
        if (existingShoppingList) {
            setShoppingList(JSON.parse(existingShoppingList));
        }
    }, []);

    const handleReturnToShoppingList = (id: number) => {
        const itemToReturn = history.find(item => item.id === id);
        if (itemToReturn) {
            // Add the item back to the shopping list
            const updatedShoppingList = [...shoppingList, { ...itemToReturn, bought: false }];
            setShoppingList(updatedShoppingList);
            localStorage.setItem('shoppingList', JSON.stringify(updatedShoppingList));

            // Remove the item from history
            const updatedHistory = history.filter(item => item.id !== id);
            setHistory(updatedHistory);
            localStorage.setItem('shoppingHistory', JSON.stringify(updatedHistory));
        }
    };

    const handleDeleteFromHistory = (id: number) => {
        const updatedHistory = history.filter(item => item.id !== id);
        setHistory(updatedHistory);
        localStorage.setItem('shoppingHistory', JSON.stringify(updatedHistory));
    };

    const sortedHistory = history.sort((a, b) => a.produto.localeCompare(b.produto));

    return (
        <div className="flex flex-col items-center justify-center p-2 text-sm">
            {history.length > 0 ? (
                <table className="bg-gray-100 rounded-md min-w-96">
                    <tbody>
                        {sortedHistory.map((item) => (
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
