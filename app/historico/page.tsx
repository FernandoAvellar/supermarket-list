"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { HistoryItem } from "@/types";
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";
import {
  deleteFromHistory,
  getHistory,
  returnToShopping,
} from "../actions/serverActions";

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const data = await getHistory();
        setHistory(data);

        // inicia todas categorias abertas
        const initialState: any = {};
        data.forEach((item) => {
          initialState[item.categoria] = true;
        });
        setOpenCategories(initialState);

      } catch (error) {
        console.error("Erro ao carregar o histórico:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

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
      grouped[category].sort((a, b) => a.produto.localeCompare(b.produto));
    });

    return grouped;
  };

  const itemsByCategory = groupedAndSortedHistory();

  return (
    <div className="flex flex-col items-center justify-center p-2 text-sm">
      {history.length > 0 ? (
        <table className="bg-gray-100 rounded-md min-w-96 max-w-md w-auto mx-auto">
          <tbody>
            {Object.keys(itemsByCategory).map((category, catIndex) => {
              const isOpen = openCategories[category] ?? false;

              return (
                <React.Fragment key={catIndex}>
                  
                  {/* Cabeçalho da categoria — clicável */}
                  <tr
                    className="bg-gray-200 cursor-pointer select-none"
                    onClick={() =>
                      setOpenCategories((prev) => ({
                        ...prev,
                        [category]: !prev[category],
                      }))
                    }
                  >
                    <td colSpan={2} className="p-2 font-semibold text-left">
                    <div className="flex items-center gap-2">
                      {isOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                      </div>
                    </td>
                  </tr>

                  {/* Itens da categoria (somente se aberta) */}
                  {isOpen &&
                    itemsByCategory[category].map((item) => (
                      <tr key={item.id}>
                        <td className="p-2">{item.produto}</td>

                        <td className="flex items-center justify-end">
                          <Button
                            onClick={() => handleReturnToShoppingList(item.id)}
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
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-red-600">Não há itens no histórico.</p>
      )}
    </div>
  );
};

export default HistoryPage;
