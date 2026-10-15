import {
	BarChartBig,
	Calendar1Icon,
	CalendarClockIcon,
	CalendarDays,
	ChartColumnDecreasing,
	Heart,
	Home,
	LayoutDashboard,
	LineChart,
	ListOrdered,
	type LucideIcon,
	type LucideProps,
	PiggyBankIcon,
	Repeat2,
	Search,
	SettingsIcon,
	SquarePlus,
	Tags,
	UserCogIcon,
	UserIcon,
} from "lucide-react";
import type { ForwardRefExoticComponent } from "react";

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
			title: "Profile",
			href: "/profile",
			icon: UserIcon,
		},
	],
};

export type NavLinkItem = {
	href: string;
	label: string;
	icon: LucideIcon;
};

type NavSection = {
	title: string;
	items: NavLinkItem[];
};

export const mainNavSections: NavSection[] = [
	{
		title: "Dashboard",
		items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
	},
	{
		title: "Planning",
		items: [
			{ href: "/budgets", label: "Budgets", icon: PiggyBankIcon },
			{ href: "/planned-transactions", label: "Planned", icon: CalendarClockIcon },
		],
	},
	{
		title: "Transactions",
		items: [
			{ href: "/transactions/new", label: "New transaction", icon: SquarePlus },
			{ href: "/transactions", label: "Transactions", icon: ListOrdered },
			{ href: "/transactions/recurring", label: "Recurring", icon: Repeat2 },
			{ href: "/transactions/favorites", label: "Favorites", icon: Heart },
		],
	},
	{
		title: "Analysis",
		items: [
			{ href: "/monthly", label: "Monthly", icon: Calendar1Icon },
			{ href: "/annual", label: "Annual", icon: CalendarDays },
			{ href: "/insights", label: "Insights", icon: LineChart },
			{ href: "/statistics", label: "Statistics", icon: BarChartBig },
		],
	},
	{
		title: "Setup",
		items: [{ href: "/categories", label: "Categories", icon: Tags }],
	},
	{
		title: "Account & Profile",
		items: [
			{ href: "/accounts", label: "Accounts", icon: UserCogIcon },
			{ href: "/profile", label: "Profile", icon: UserCogIcon },
			{ href: "/settings", label: "Settings", icon: SettingsIcon },
		],
	},
];
