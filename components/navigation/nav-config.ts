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
  ],
};
