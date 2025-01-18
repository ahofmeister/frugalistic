"use client";

import { ArrowUpRight } from "lucide-react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useState } from "react";

import AppButton from "@/components/auth/app-button";
import { navConfig } from "@/components/navigation/nav-config";
import { siteConfig } from "@/components/site-config";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export function PublicMobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <span className="md:hidden flex items-center w-full px-6">
      <Link
        href="/"
        className="flex font-semibold text-primary text-xl items-center"
      >
        {siteConfig.name}
      </Link>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            className="ml-auto h-8 w-8 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9h16.5m-16.5 6.75h16.5"
              />
            </svg>
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-6">
          <DrawerTitle></DrawerTitle>
          <div className="overflow-auto py-6">
            <div className="flex flex-col space-y-3">
              {navConfig.publicNavigation?.map(
                (item) =>
                  item.href && (
                    <MobileLink
                      key={item.href}
                      href={item.href}
                      onOpenChange={setOpen}
                    >
                      <div className="flex gap-x-1 items-center">
                        {item.title}
                        {item.external && <ArrowUpRight size="15" />}
                      </div>
                    </MobileLink>
                  ),
              )}
            </div>
          </div>
          <AppButton />
        </DrawerContent>
      </Drawer>
    </span>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  href: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn("text-base", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
