"use client"
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { categorias, cn, item } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const InsertPage = () => {
    const [shoppingList, setShoppingList] = useState<Array<{ id: number; produto: string; categoria: string }>>([]);

    useEffect(() => {
        const existingItems = localStorage.getItem('shoppingList');
        if (existingItems) {
            setShoppingList(JSON.parse(existingItems));
        }
    }, []);

    const form = useForm<z.infer<typeof item>>({
        resolver: zodResolver(item),
        defaultValues: {
            produto: "",
            categoria: "diversos",
        },
    })

    function generateUniqueId() {
        return Date.now() + Math.floor(Math.random() * 1000);
    }

    function onSubmit(data: z.infer<typeof item>) {
        const newItem = { id: generateUniqueId(), ...data };
        const updatedList = [...shoppingList, newItem];
        setShoppingList(updatedList);
        localStorage.setItem('shoppingList', JSON.stringify(updatedList));
        form.resetField("produto");
    }

    return (
        <Form {...form}>
            <div className='flex flex-col w-fit min-w-96 mx-auto items-center justify-center p-4 bg-gray-100 rounded-md'>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    <FormField
                        control={form.control}
                        name="produto"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm font-semibold'>Produto</FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite o nome do produto" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoria"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className='text-sm font-semibold'>Categoria</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-fit justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? categorias.find(
                                                        (categoria) => categoria.value === field.value
                                                    )?.label
                                                    : "Selecione a categoria"}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-40 m-0 p-0">
                                        <Command>
                                            <CommandList>
                                                <CommandGroup>
                                                    {categorias.map((categoria) => (
                                                        <CommandItem
                                                            value={categoria.label}
                                                            key={categoria.value}
                                                            onSelect={() => {
                                                                form.setValue("categoria", categoria.value)
                                                            }}
                                                        >
                                                            {categoria.label}
                                                            <CheckIcon
                                                                className={cn(
                                                                    "ml-auto size-4",
                                                                    categoria.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className='w-full bg-blue-500 text-sm'>Inserir</Button>
                </form>
            </div>
        </Form>
    )
}

export default InsertPage;
