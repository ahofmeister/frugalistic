"use client";

import clsx from "clsx";
import { LogOutIcon, type LucideIcon, Menu, MessageSquareText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { createContext, useContext, useState, ViewTransition } from "react";
import { signOut } from "@/features/auth/auth-actions";
import FeedbackCard from "@/features/feedback/feedback-card";
import { mainNavSections, type NavLinkItem } from "@/features/navigation/nav-config";

const allHrefs = mainNavSections.flatMap((section) => section.items.map((item) => item.href));

function getActiveHref(pathname: string) {
	return allHrefs
		.filter((href) => pathname === href || pathname.startsWith(`${href}/`))
		.sort((a, b) => b.length - a.length)[0];
}

const NavigationContext = createContext<() => void>(() => {});

const itemClassName = "flex items-center px-3 py-2 text-sm rounded-md transition-colors";

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
			{children}
		</div>
	);
}

function NavLink({ item, activeHref }: { item: NavLinkItem; activeHref: string | undefined }) {
	const onNavigate = useContext(NavigationContext);
	const isActive = item.href === activeHref;
	const Icon = item.icon;

	return (
		<Link
			href={item.href}
			onClick={onNavigate}
			className={clsx(
				"relative",
				itemClassName,
				isActive
					? "text-foreground font-medium"
					: "text-muted-foreground hover:text-foreground hover:bg-accent",
			)}
		>
			{isActive && (
				<ViewTransition name="nav-active-indicator">
					<span className="absolute inset-0 rounded-md bg-accent" />
				</ViewTransition>
			)}
			<span className="relative flex items-center">
				<Icon className="h-4 w-4 mr-3 shrink-0" />
				{item.label}
			</span>
		</Link>
	);
}

function NavButton({
	icon: Icon,
	children,
	onClick,
}: {
	icon: LucideIcon;
	children: React.ReactNode;
	onClick?: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={clsx(
				itemClassName,
				"text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer",
			)}
		>
			<Icon className="h-4 w-4 mr-3 shrink-0" />
			{children}
		</button>
	);
}

export default function MainNavigation() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const activeHref = getActiveHref(pathname);

	function handleNavigation() {
		setIsMobileMenuOpen(false);
	}

	return (
		<NavigationContext.Provider value={handleNavigation}>
			<div className="md:hidden fixed top-0 left-0 right-0 z-70 bg-background flex justify-between items-center px-4 py-3 border-b border-border">
				<Image
					src="/icon-192x192.png"
					alt="Frugalistic"
					width={32}
					height={32}
					className="shrink-0"
				/>
				<button
					type="button"
					className="p-2 rounded-lg hover:bg-accent"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
				>
					<Menu className="h-5 w-5 text-foreground" />
				</button>
			</div>

			<nav
				className={clsx(
					"fixed inset-y-0 left-0 z-65 w-64 bg-background transform transition-transform duration-200 ease-in-out",
					"md:translate-x-0 md:static md:w-64 border-r border-border",
					"md:top-0 top-16",
					isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
				)}
			>
				<div className="h-full flex flex-col">
					<Link href="/dashboard" className="h-16 px-6 flex items-center border-b border-border">
						<div className="flex items-center gap-3">
							<Image
								src="/icon-192x192.png"
								alt="Frugalistic"
								width={32}
								height={32}
								className="shrink-0"
							/>
							<span className="text-lg font-semibold hover:cursor-pointer text-primary">
								Frugalistic
							</span>
						</div>
					</Link>

					<div className="flex-1 overflow-y-auto py-4 px-4">
						<div className="space-y-6">
							{mainNavSections.map((section) => (
								<div key={section.title}>
									<SectionTitle>{section.title}</SectionTitle>
									<div className="space-y-1">
										{section.items.map((item) => (
											<NavLink key={item.href} item={item} activeHref={activeHref} />
										))}
									</div>
								</div>
							))}

							<div>
								<SectionTitle>Support</SectionTitle>
								<div className="space-y-1">
									<NavButton icon={MessageSquareText}>
										<FeedbackCard />
									</NavButton>
								</div>
							</div>
						</div>
					</div>

					<div className="px-4 py-4 border-t border-border">
						<NavButton icon={LogOutIcon} onClick={() => signOut()}>
							Sign Out
						</NavButton>
					</div>
				</div>
			</nav>
		</NavigationContext.Provider>
	);
}
