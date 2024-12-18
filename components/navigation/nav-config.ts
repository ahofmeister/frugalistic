import {
  ChartColumnDecreasing,
  History,
  LayoutDashboard,
  LucideProps,
  Search,
  Table,
} from "lucide-react";
import { ForwardRefExoticComponent } from "react";

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
}

export interface NavConfig {
  dashboardNavigation: NavItem[];
  publicNavigation: NavItem[];
}

export const navConfig: NavConfig = {
  dashboardNavigation: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Categories",
      href: "/dashboard/categories",
      icon: Table,
    },
    {
      title: "Search",
      href: "/dashboard/search",
      icon: Search,
    },
    {
      title: "Recurring",
      href: "/dashboard/recurring",
      icon: History,
    },
    {
      title: "Insights",
      href: "/dashboard/insights",
      icon: ChartColumnDecreasing,
    },
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
