import { LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";

import AuthButton from "@/components/auth/auth-button";
import { navConfig } from "@/components/navigation/nav-config";
import { siteConfig } from "@/components/site-config";
import { Button } from "@/components/ui/button";

const DashboardNavigation = () => {
  return (
    <div className="flex flex-col w-60 h-screen text-center border-r border-r-gray-800">
      <div className="text-2xl text-primary font-semibold p-8 text-left border-b border-gray-800">
        <Link href={"/"}>{siteConfig.name}</Link>
      </div>
      <div className="flex-1 overflow-y-auto pb-16">
        <Link href="/dashboard/transactions/new">
          <Button size="sm" className="my-4">
            New Transaction
          </Button>
        </Link>
        {navConfig.dashboardNavigation.map((item) => {
          const IconComponent = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex px-6 py-4 gap-x-3 rounded text-gray-400 hover:bg-gray-800 hover:text-white items-center text-left hover:text-primary"
            >
              {IconComponent && <IconComponent size={20} fill="#123123" />}
              {item.title}
            </Link>
          );
        })}
      </div>
      <div className="flex p-6 items-center text-gray-400">
        <LogOut size={20} />
        <AuthButton />
      </div>
    </div>
  );
};

export default DashboardNavigation;
