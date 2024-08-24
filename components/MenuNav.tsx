import React from 'react'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from 'next/link'

const MenuNav = () => {
    return (
        <nav className='flex p-3 items-center justify-center'>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/comprar" legacyBehavior passHref>
                            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-gray-500 font-semibold`}>
                                COMPRAR
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/historico" legacyBehavior passHref>
                            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-blue-500 font-semibold`}>
                                HISTÓRICO
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/inserir" legacyBehavior passHref>
                            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-green-500 font-semibold`}>
                                INSERIR
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </nav>
    )
}

export default MenuNav