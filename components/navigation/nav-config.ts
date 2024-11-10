import {
  ArrowRightLeft,
  ChartColumnDecreasing,
  History,
  LayoutDashboard,
  LucideProps,
  Table,
} from "lucide-react";
import { ForwardRefExoticComponent } from "react";

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  items?: NavItem[];
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
      title: "Transactions",
      href: "/dashboard/transactions",
      icon: ArrowRightLeft,
    },
    {
      title: "Recurring",
      href: "/dashboard/recurring",
      icon: History,
    },
    {
      title: "Statistic",
      href: "/dashboard/statistic",
      icon: ChartColumnDecreasing,
      items: [
        {
          title: "Type",
          href: "/dashboard/statistic/type",
          icon: ChartColumnDecreasing,
        },

        {
          title: "Category",
          href: "/dashboard/statistic/category",
          icon: ChartColumnDecreasing,
        },
      ],
    },
  ],
  publicNavigation: [
    {
      title: "Blog",
      href: "/blog",
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
