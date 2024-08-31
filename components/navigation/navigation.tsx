import React from "react";

import AppButton from "@/components/auth/app-button";
import AuthButton from "@/components/auth/auth-button";
import MainNavigation from "@/components/navigation/main-navigation";
import MobileNavigation from "@/components/navigation/mobile-navigation";
import { NavItem } from "@/components/navigation/nav-config";

const Navigation = ({
  items,
  publicArea,
}: {
  items: NavItem[];
  publicArea: boolean;
}) => {
  return (
    <div className="sticky top-0 z-40 transform">
      <nav className="relative z-40 border-default border-b backdrop-blur-sm transition-opacity">
        <div className="relative flex justify-between h-16 mx-auto lg:container lg:px-16 xl:px-20">
          <div className="flex items-center px-6 lg:px-0 flex-1 sm:items-stretch justify-between">
            <MainNavigation items={items} loggedIn={!publicArea} />
            <div className="flex gap-x-5">
              <AppButton publicArea={publicArea} />
              <AuthButton />
            </div>
          </div>

          <div className="inset-y-0 flex mr-2 items-center px-4 lg:hidden">
            <MobileNavigation items={items} />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
