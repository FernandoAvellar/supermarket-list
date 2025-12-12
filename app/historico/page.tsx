"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { HistoryItem } from "@/types";
import { Loader2 } from "lucide-react";
import {
  deleteFromHistory,
  getHistory,
  returnToShopping,
} from "../actions/serverActions";

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollPositionRef = useRef(0);

  // Carrega histórico
  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (error) {
        console.error("Erro ao carregar o histórico:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  // Restaura o scroll sem perder a posição
  const restoreScroll = () => {
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPositionRef.current);
    });
  };

  const handleReturnToShoppingList = async (id: number) => {
    scrollPositionRef.current = window.scrollY;
    setLoading(true);

    try {
      await returnToShopping(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erro ao mover item:", error);
    } finally {
      setLoading(false);
      restoreScroll();
    }
  };

  const handleDeleteFromHistory = async (id: number) => {
    scrollPositionRef.current = window.scrollY;
    setLoading(true);

    try {
      await deleteFromHistory(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erro ao deletar item:", error);
    } finally {
      setLoading(false);
      restoreScroll();
    }
  };

  const groupedAndSortedHistory = () => {
    const grouped: { [key: string]: HistoryItem[] } = {};

    history.forEach((item) => {
      if (!grouped[item.categoria]) grouped[item.categoria] = [];
      grouped[item.categoria].push(item);
    });

    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) =>
        a.produto.localeCompare(b.produto)
      );
    });

    return grouped;
  };

  const itemsByCategory = groupedAndSortedHistory();

  return (
    <div className="flex flex-col items-center justify-center p-2 text-sm">
      {history.length > 0 ? (
        <table className="bg-gray-100 rounded-md min-w-96">
          <tbody>
            {Object.keys(itemsByCategory).map((category, catIndex) => (
              <React.Fragment key={catIndex}>
                <tr className="bg-gray-200">
                  <td colSpan={2} className="p-2 font-semibold text-left">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </td>
                </tr>

                {itemsByCategory[category].map((item) => (
                  <tr key={item.id}>
                    <td className="p-2">{item.produto}</td>

                    <td className="flex items-center justify-end">
                      <Button
                        onClick={() =>
                          handleReturnToShoppingList(item.id)
                        }
                        disabled={loading}
                        variant="default"
                        className="bg-blue-500 text-xs px-2 m-1 flex items-center gap-1"
                      >
                        {loading && (
                          <Loader2 size={14} className="animate-spin" />
                        )}
                        Recomprar
                      </Button>

                      <Button
                        onClick={() => handleDeleteFromHistory(item.id)}
                        disabled={loading}
                        variant="destructive"
                        className="text-xs px-1 mr-2 flex items-center gap-1"
                      >
                        {loading && (
                          <Loader2 size={14} className="animate-spin" />
                        )}
                        Apagar
                      </Button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-red-600">Não há itens no histórico.</p>
      )}
    </div>
  );
};

export default HistoryPage;
