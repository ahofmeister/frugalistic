export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof String;
  label?: string;
}

export interface DocsConfig {
  mainNav: NavItem[];
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Categories",
      href: "/categories",
    },
    {
      title: "Transactions",
      href: "/transactions",
    },
    {
      title: "Year",
      href: "/year",
    },
  ],
};
