import Link from "next/link";

import { NavItem } from "@/components/navigation/nav-config";
import { NewTransactionLink } from "@/components/new-transaction-link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarMenu>
      <NewTransactionLink />
      {items.map((item) => (
        <Link href={item.href} key={item.href}>
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title} asChild>
              <div className="flex">
                {item.icon && <item.icon />}

                <span>{item.title}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </Link>
      ))}
    </SidebarMenu>
  );
}
