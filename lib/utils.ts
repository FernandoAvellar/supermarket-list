import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formSchema = z.object({
    produto: z.string().min(3, {
        message: "Nome do produto deve conter no mínimo 3 letras",
    }),
    categoria: z.string(),
})

export const categorias = [
    { label: "Limpeza", value: "limpeza" },
    { label: "Frios", value: "frios" },
    { label: "Carnes", value: "carnes" },
    { label: "Verduras e Frutas", value: "verduras" },
    { label: "Diversos", value: "diversos" },
    { label: "Higiene pessoal", value: "higiene" },
] as const
