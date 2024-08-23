"use client"
import React, { useEffect, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

const BuyPage = () => {
    const [shoppingList, setShoppingList] = useState<{ id: number; produto: string; categoria: string; bought: boolean }[]>([]);
    const [history, setHistory] = useState<{ id: number; produto: string; categoria: string }[]>([]);

    useEffect(() => {
        // Load shopping list from localStorage when the component mounts
        const existingItems = localStorage.getItem('shoppingList');
        if (existingItems) {
            setShoppingList(JSON.parse(existingItems));
        }
        // Load history from localStorage
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

    // Function to group items by category and sort them
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
        <div className="flex flex-col items-start p-2 mx-auto w-fit bg-gray-100">
            <h1 className="text-xl font-bold mb-4">Lista de Compras</h1>
            {Object.keys(itemsByCategory).map((category, catIndex) => (
                <div key={catIndex} className="mb-6">
                    <h2 className="text-md font-semibold mb-2">{category}</h2>
                    <ul className="space-y-2">
                        {itemsByCategory[category].map((item) => (
                            <li key={item.id} className="flex items-center">
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
            <Button onClick={handleClearBoughtItems} className="mt-4">
                REMOVER COMPRADOS
            </Button>
        </div>
    )
}

export default BuyPage;
