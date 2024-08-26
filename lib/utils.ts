import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const item = z.object({
    produto: z.string().min(3, {
        message: "Nome do produto deve conter no mínimo 3 letras",
    }),
    categoria: z.string(),
})

export const categorias = [
    { label: "Bebidas", value: "bebidas" },
    { label: "Carnes", value: "carnes" },
    { label: "Diversos", value: "diversos" },
    { label: "Frios", value: "frios" },
    { label: "Higiene pessoal", value: "higiene" },
    { label: "Limpeza", value: "limpeza" },
    { label: "Hortifrute", value: "hortifrute" },
] as const
