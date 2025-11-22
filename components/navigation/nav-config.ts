import {
  ChartColumnDecreasing,
  Home,
  LucideProps,
  Search,
  SquarePlus,
  UserIcon,
} from "lucide-react";
import { ForwardRefExoticComponent } from "react";

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
}

export type NavItemIcon = NavItem & {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
};

export interface NavConfig {
  dashboardNavigation: NavItemIcon[];
}

export const navConfig: NavConfig = {
  dashboardNavigation: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Search",
      href: "/transactions",
      icon: Search,
    },

    {
      title: "Add",
      href: "/transactions/new",
      icon: SquarePlus,
    },
    {
      title: "Insights",
      href: "/insights",
      icon: ChartColumnDecreasing,
    },
    {
      title: "Account",
      href: "/account",
      icon: UserIcon,
    },
  ],
};
