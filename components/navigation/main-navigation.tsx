import Link from "next/link";
import React from "react";

import { NavItem } from "@/components/navigation/nav-config";

const MainNavigation = ({ items }: { items: NavItem[] }) => {
  return (
    <div className="flex items-center">
      <div className="flex items-center flex-shrink-0">
        <Link
          className="font-bold text-primary block w-auto h-6 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-foreground-lighter focus-visible:ring-offset-4 focus-visible:ring-offset-background-alternative focus-visible:rounded-sm"
          type="button"
          id="radix-:R5amda6:"
          aria-haspopup="menu"
          aria-expanded="false"
          data-state="closed"
          href="/"
        >
          Frugalistic
        </Link>
      </div>

      <nav
        aria-label="Main"
        data-orientation="horizontal"
        dir="ltr"
        className="relative z-10 flex-1 items-center justify-center hidden pl-8 sm:space-x-4 lg:flex h-16"
      >
        <div>
          <ul
            data-orientation="horizontal"
            className="group flex flex-1 list-none items-center justify-center space-x-1"
            dir="ltr"
          >
            {items.map((item) => (
              <li key={item.href} className="text-sm font-medium">
                <Link
                  href={item.href}
                  id="radix-:R2amda6:-trigger-radix-:R1eamda6:"
                  data-state="closed"
                  aria-expanded="false"
                  aria-controls="radix-:R2amda6:-content-radix-:R1eamda6:"
                  className="group relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground hover:bg-surface-300 shadow-none focus-visible:outline-border-strong data-[state=open]:bg-surface-300 data-[state=open]:outline-border-strong border-transparent text-sm leading-4 py-2 !bg-transparent hover:text-brand-link data-[state=open]:!text-brand-link data-[radix-collection-item]:focus-visible:ring-2 data-[radix-collection-item]:focus-visible:ring-foreground-lighter data-[radix-collection-item]:focus-visible:text-foreground px-2 h-auto"
                  data-radix-collection-item=""
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute left-0 top-full flex justify-center"></div>
      </nav>
    </div>
  );
};

export default MainNavigation;
