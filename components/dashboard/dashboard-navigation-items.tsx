"use client";
import React from "react";

import { navConfig } from "@/components/navigation/nav-config";
import NavigationItem from "@/components/navigation/navigation-item";

const DashboardNavigationItems = () => {
  return (
    <div>
      {navConfig.dashboardNavigation.map((item) => (
        <NavigationItem key={item.href} item={item} />
      ))}
    </div>
  );
};

export default DashboardNavigationItems;
