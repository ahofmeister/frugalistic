import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";

import AppButton from "@/components/auth/app-button";
import AuthButton from "@/components/auth/auth-button";
import { NavItem } from "@/components/navigation/nav-config";

const Navigation = ({
  items,
  publicArea,
}: {
  items: NavItem[];
  publicArea: boolean;
}) => {
  return (
    <div className="sticky top-0 z-40 transform">
      <nav className="relative z-40 border-default border-b backdrop-blur-sm transition-opacity">
        <div className="relative flex justify-between h-16 mx-auto lg:container lg:px-16 xl:px-20">
          <div className="px-6 lg:px-0 flex-1 sm:items-stretch">
            <div className="flex items-center h-16 justify-between">
              <div className="flex items-center">
                <div className="flex items-center flex-shrink-0">
                  <Link
                    className="font-bold text-primary block w-auto h-6 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-foreground-lighter focus-visible:ring-offset-4 focus-visible:ring-offset-background-alternative focus-visible:rounded-sm"
                    type="button"
                    id="radix-:R5amda6:"
                    aria-haspopup="menu"
                    aria-expanded="false"
                    data-state="closed"
                    href={!publicArea ? "/dashboard" : "/"}
                  >
                    Frugalistic
                  </Link>
                </div>

                <nav
                  aria-label="Main"
                  data-orientation="horizontal"
                  dir="ltr"
                  className="relative z-10 flex-1 items-center lg:justify-between hidden pl-8 sm:space-x-4 lg:flex"
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
                            target={item.external ? "_blank" : ""}
                            id="radix-:R2amda6:-trigger-radix-:R1eamda6:"
                            data-state="closed"
                            aria-expanded="false"
                            aria-controls="radix-:R2amda6:-content-radix-:R1eamda6:"
                            className="group relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground hover:bg-surface-300 shadow-none focus-visible:outline-border-strong data-[state=open]:bg-surface-300 data-[state=open]:outline-border-strong border-transparent text-sm leading-4 py-2 !bg-transparent hover:text-brand-link data-[state=open]:!text-brand-link data-[radix-collection-item]:focus-visible:ring-2 data-[radix-collection-item]:focus-visible:ring-foreground-lighter data-[radix-collection-item]:focus-visible:text-foreground px-2 h-auto"
                            data-radix-collection-item=""
                          >
                            {item.title}
                            {item.external && (
                              <ArrowUpRight className="ml-1" size="15" />
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </nav>
              </div>

              <div className="lg:flex items-center gap-x-5 hidden">
                <AppButton loggedIn={!publicArea} />
                <AuthButton />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
