"use client"
import React, { useEffect, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

const BuyPage = () => {
    const [shoppingList, setShoppingList] = useState<{ id: number; produto: string; categoria: string; bought: boolean }[]>([]);
    const [history, setHistory] = useState<{ id: number; produto: string; categoria: string }[]>([]);

    useEffect(() => {
        const existingItems = localStorage.getItem('shoppingList');
        if (existingItems) {
            setShoppingList(JSON.parse(existingItems));
        }
        const existingHistory = localStorage.getItem('shoppingHistory');
        if (existingHistory) {
            setHistory(JSON.parse(existingHistory));
        }
    }, []);

    const handleCheckboxChange = (id: number) => {
        const updatedList = shoppingList.map(item =>
            item.id === id ? { ...item, bought: !item.bought } : item
        );
        setShoppingList(updatedList);
        localStorage.setItem('shoppingList', JSON.stringify(updatedList));
    };

    const handleClearBoughtItems = () => {
        const boughtItems = shoppingList.filter(item => item.bought);
        const remainingItems = shoppingList.filter(item => !item.bought);

        setShoppingList(remainingItems);
        setHistory([...history, ...boughtItems.map(({ id, produto, categoria }) => ({ id, produto, categoria }))]);

        localStorage.setItem('shoppingList', JSON.stringify(remainingItems));
        localStorage.setItem('shoppingHistory', JSON.stringify([...history, ...boughtItems.map(({ id, produto, categoria }) => ({ id, produto, categoria }))]));
    };

    const groupedAndSortedItems = () => {
        const groupedItems: { [key: string]: { id: number; produto: string; categoria: string; bought: boolean }[] } = {};

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
            <Button onClick={handleClearBoughtItems} variant="destructive" className="mt-4 w-full" disabled={shoppingList.length === 0}>
                Remover
            </Button>
        </div>
    )
}

export default BuyPage;
