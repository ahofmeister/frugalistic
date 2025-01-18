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
  publicNavigation: NavItem[];
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
      href: "/dashboard/search",
      icon: Search,
    },

    {
      title: "Add",
      href: "/dashboard/transactions/new",
      icon: SquarePlus,
    },
    {
      title: "Insights",
      href: "/dashboard/insights",
      icon: ChartColumnDecreasing,
    },
    {
      title: "Account",
      href: "/dashboard/account",
      icon: UserIcon,
    },
    // {
    //   title: "Categories",
    //   href: "/dashboard/categories",
    //   icon: Table,
    // },

    // {
    //   title: "Recurring",
    //   href: "/dashboard/recurring",
    //   icon: History,
    // },
    // {
    //   title: "Insights",
    //   href: "/dashboard/insights",
    //   icon: LineChart,
    // },
    //
  ],
  publicNavigation: [
    {
      title: "About",
      href: "/about",
    },

    {
      title: "Change Log",
      href: "/change-log",
    },
    {
      title: "Roadmap",
      external: true,
      href: "https://alexander-hofmeister.notion.site/Frugalistic-Roadmap-787863f18f044b68ba716d9a439f06c6?pvs=74",
    },
  ],
};
