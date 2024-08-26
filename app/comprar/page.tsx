"use client"
import React, { useEffect, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ShoppingItem } from '@/types'
import { Loader2 } from 'lucide-react';

const BuyPage = () => {
    const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchShoppingList() {
            setLoading(true);
            try {
                const response = await fetch('/api/get-items');
                const data = await response.json();
                setShoppingList(data);
            } catch (error) {
                console.error('Erro ao carregar a lista de compras:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchShoppingList();
    }, []);

    const handleCheckboxChange = async (id: number) => {
        const updatedList = shoppingList.map(item =>
            item.id === id ? { ...item, bought: !item.bought } : item
        );
        setShoppingList(updatedList);

        // Atualizar o status do item no banco de dados
        await fetch(`/api/update-item/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bought: updatedList.find(item => item.id === id)?.bought }),
        });
    };

    const handleRemoveItems = async () => {
        const boughtItems = shoppingList.filter(item => item.bought);
        const remainingItems = shoppingList.filter(item => !item.bought);

        try {
            const response = await fetch('/api/move-to-history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(boughtItems.map(item => item.id)),
            });

            if (!response.ok) {
                throw new Error('Erro ao mover itens para o histórico.');
            }

            setShoppingList(remainingItems);
        } catch (error) {
            console.error('Erro ao remover itens comprados:', error);
        }
    };

    const groupedAndSortedItems = () => {
        const groupedItems: { [key: string]: ShoppingItem[] } = {};

        shoppingList.forEach(item => {
            if (!groupedItems[item.categoria]) {
                groupedItems[item.categoria] = [];
            }
            groupedItems[item.categoria].push(item);
        });

        Object.keys(groupedItems).forEach(category => {
            groupedItems[category].sort((a, b) => a.produto.localeCompare(b.produto));
        });

        return groupedItems;
    };

    const itemsByCategory = groupedAndSortedItems();

    if (loading) {
        return (
            <div className='flex flex-row items-center justify-center'>
                <Loader2 size={20} className="animate-spin" /> &nbsp;Loading...
            </div>
        )
    }

    return (
        <div className="flex flex-col items-start p-2 mx-auto min-w-96 bg-gray-100 border">
            {shoppingList.length === 0 ? (<h2 className="flex items-center mx-auto text-md mb-2">Não há itens na lista de compras</h2>) : (<></>)}
            {Object.keys(itemsByCategory).map((category, catIndex) => (
                <div key={catIndex} className="ml-2 mb-1">
                    <h2 className="text-md font-medium mb-1">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                    <ul className="space-y-1">
                        {itemsByCategory[category].map((item) => (
                            <li key={item.id} className="flex items-center text-sm">
                                <Checkbox
                                    checked={item.bought}
                                    onCheckedChange={() => handleCheckboxChange(item.id)}
                                />
                                <span className={`ml-2 ${item.bought ? 'line-through text-gray-500' : ''}`}>
                                    {item.produto}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <Button onClick={handleRemoveItems} variant="destructive" className="mt-4 w-full" disabled={shoppingList.length === 0 || loading}>
                Remover
            </Button>
        </div>
    )
}

export default BuyPage;
