export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof String;
  label?: string;
}

export interface NavConfig {
  dashboardNavigation: NavItem[];
  publicNavigation: NavItem[];
}

export const navConfig: NavConfig = {
  dashboardNavigation: [
    {
      title: "Categories",
      href: "/dashboard/categories",
    },
    {
      title: "Transactions",
      href: "/dashboard/transactions",
    },
    {
      title: "Year",
      href: "/dashboard/year",
    },
  ],
  publicNavigation: [
    {
      title: "Updates",
      href: "/updates",
    },
  ],
};
