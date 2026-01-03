"use client";

import {
  BarChartBig,
  CalendarRangeIcon,
  Heart,
  LayoutDashboard,
  LineChart,
  ListOrdered,
  LogOutIcon,
  LucideIcon,
  Menu,
  MessageSquareText,
  Repeat2,
  SettingsIcon,
  SquarePlus,
  Tags,
  UserCogIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import FeedbackCard from "@/components/feedback/feedback-card";
import { signOut } from "@/components/auth/auth-actions";

export default function MainNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  function handleNavigation() {
    setIsMobileMenuOpen(false);
  }

  function NavItem({
    href,
    icon: Icon,
    children,
    noLink,
    onClick,
  }: {
    href?: string;
    icon?: LucideIcon;
    children: React.ReactNode;
    noLink?: boolean;
    onClick?: () => void;
  }) {
    const isActive = href && pathname === href;

    const content = (
      <>
        {Icon && <Icon className="h-4 w-4 mr-3 shrink-0 cursor-pointer" />}
        {children}
      </>
    );

    if (noLink || onClick) {
      return (
        <div
          onClick={onClick}
          className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
        >
          {content}
        </div>
      );
    }

    return (
      <Link
        href={href || "#"}
        onClick={handleNavigation}
        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
          isActive
            ? "bg-accent text-foreground font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        }`}
      >
        {content}
      </Link>
    );
  }

  return (
    <>
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
        className={`
          fixed inset-y-0 left-0 z-65 w-64 bg-background transform transition-transform duration-200 ease-in-out
          md:translate-x-0 md:static md:w-64 border-r border-border
          md:top-0 top-16
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">
          <Link
            href="/dashboard"
            className="h-16 px-6 flex items-center border-b border-border"
          >
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
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Overview
                </div>
                <div className="space-y-1">
                  <NavItem href="/dashboard" icon={LayoutDashboard}>
                    Dashboard
                  </NavItem>
                  <NavItem href="/insights" icon={LineChart}>
                    Insights
                  </NavItem>
                  <NavItem href="/statistics" icon={BarChartBig}>
                    Statistics
                  </NavItem>
                  <NavItem href="/annual" icon={CalendarRangeIcon}>
                    Annual
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Transactions
                </div>
                <div className="space-y-1">
                  <NavItem href="/transactions/new" icon={SquarePlus}>
                    New transaction
                  </NavItem>
                  <NavItem href="/transactions" icon={ListOrdered}>
                    Transactions
                  </NavItem>
                  <NavItem href="/transactions/recurring" icon={Repeat2}>
                    Recurring
                  </NavItem>
                  <NavItem href="/transactions/favorites" icon={Heart}>
                    <div className="flex gap-x-2 items-center">
                      <span>Favorites</span>
                    </div>
                  </NavItem>
                  <NavItem href="/categories" icon={Tags}>
                    Categories
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Support
                </div>
                <div className="space-y-1">
                  <NavItem icon={MessageSquareText} noLink>
                    <FeedbackCard />
                  </NavItem>
                </div>
              </div>
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Account
                </div>
                <div className="space-y-1">
                  <NavItem href="/account" icon={UserCogIcon}>
                    Account
                  </NavItem>
                  <NavItem href="/settings" icon={SettingsIcon}>
                    Settings
                  </NavItem>
                </div>
                <NavItem icon={LogOutIcon} onClick={() => signOut()}>
                  Sign Out
                </NavItem>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
