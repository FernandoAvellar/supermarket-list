"use client"
import React, { useEffect, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ShoppingItem } from '@/types'
import { Loader2 } from 'lucide-react';
import { getItems, moveToHistory, updateItem } from '../actions/serverActions'

const BuyPage = () => {
    const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchShoppingList() {
            setLoading(true);
            try {
                const data = await getItems();
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

        try {
            await updateItem(id, updatedList.find(item => item.id === id)?.bought ?? false);
        } catch (error) {
            console.error('Erro ao atualizar o status do item:', error);
        }
    };

    const handleRemoveItems = async () => {
        const boughtItems = shoppingList.filter(item => item.bought);
        const remainingItems = shoppingList.filter(item => !item.bought);

        try {
            await moveToHistory(boughtItems.map(item => item.id));
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
