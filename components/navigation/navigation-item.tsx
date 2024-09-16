"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { NavItem } from "@/components/navigation/nav-config";
import { cn } from "@/lib/utils";

const NavigationItem = ({ item }: { item: NavItem }) => {
  const pathname = usePathname();
  const IconComponent = item.icon;
  return (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        "flex px-6 py-4 gap-x-3 rounded text-gray-400 hover:bg-gray-800 hover:text-white items-center text-left hover:text-primary",
        {
          ["text-primary"]: pathname === item.href,
        },
      )}
    >
      {IconComponent && <IconComponent size={20} fill="#123123" />}
      {item.title}
    </Link>
  );
};
export default NavigationItem;
