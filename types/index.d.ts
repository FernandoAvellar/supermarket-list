declare type MenuType = {
  type: 'comprar' | "comprado" |"inserir";
};

export interface ShoppingItem {
    id: number;
    produto: string;
    categoria: string;
    bought: boolean;
}

interface HistoryItem {
    id: number;
    produto: string;
    categoria: string;
}

