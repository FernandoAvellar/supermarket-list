"use client"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { HistoryItem } from '@/types'
import { Loader2 } from 'lucide-react';
import { deleteFromHistory, getHistory, returnToShopping } from '../actions/serverActions';

const HistoryPage: React.FC = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchHistory() {
            setLoading(true);
            try {
                const data = await getHistory();
                setHistory(data)
            } catch (error) {
                console.error('Erro ao carregar o histórico:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, []);

    const handleReturnToShoppingList = async (id: number) => {
        setLoading(true);
        try {
            await returnToShopping(id);
            // Remover o item do histórico no estado local
            setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
        } catch (error) {
            console.error('Erro ao mover o item de volta para a lista de compras:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFromHistory = async (id: number) => {
        setLoading(true);
        try {
            await deleteFromHistory(id);
            // Atualizar o estado local removendo o item do histórico
            setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
        } catch (error) {
            console.error('Erro ao deletar o item do histórico:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='flex flex-row items-center justify-center'>
                <Loader2 size={20} className="animate-spin" /> &nbsp;Loading...
            </div>
        );
    }

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
