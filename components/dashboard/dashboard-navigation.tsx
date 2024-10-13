import { LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";

import AuthButton from "@/components/auth/auth-button";
import DashboardNavigationItems from "@/components/dashboard/dashboard-navigation-items";
import { siteConfig } from "@/components/site-config";
import { Button } from "@/components/ui/button";

const DashboardNavigation = () => {
  return (
    <div className="flex flex-col w-60 h-screen text-center border-r border-r-gray-800">
      <div className="text-xl text-primary font-semibold p-4 text-left border-b border-gray-800">
        <Link href="/">{siteConfig.name}</Link>
      </div>
      <div className="flex-1 overflow-y-auto pb-16">
        <Link href="/dashboard/transactions/new">
          <Button size="sm" className="my-4">
            New Transaction
          </Button>
        </Link>
        <DashboardNavigationItems />
      </div>
      <div className="flex p-6 items-center text-gray-400">
        <LogOut size={20} />
        <AuthButton />
      </div>
    </div>
  );
};

export default DashboardNavigation;
