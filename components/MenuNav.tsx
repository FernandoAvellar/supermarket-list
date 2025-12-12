import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

const MenuNav = () => {
  return (
    <nav className="flex p-3 items-center justify-center">
      <NavigationMenu>
        <NavigationMenuList>
           <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/comprar"
                className={`${navigationMenuTriggerStyle()} bg-gray-500 font-semibold`}
              >
                COMPRAR
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/historico"
                className={`${navigationMenuTriggerStyle()} bg-blue-500 font-semibold`}
              >
                HISTÓRICO
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/inserir"
                className={`${navigationMenuTriggerStyle()} bg-green-500 font-semibold`}
              >
                INSERIR
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};

export default MenuNav;
