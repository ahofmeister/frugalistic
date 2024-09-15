import React from "react";

import MainNavigation from "@/components/navigation/main-navigation";
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
          <div className="px-6 lg:px-0 flex-1 sm:items-stretch">
            <MainNavigation items={items} loggedIn={!publicArea} />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
