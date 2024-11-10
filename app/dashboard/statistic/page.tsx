import Link from "next/link";
import React from "react";

import { navConfig } from "@/components/navigation/nav-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatisticIntroPage = () => {
  const statisticNavItem = navConfig.dashboardNavigation.find(
    (item) => item.title === "Statistic",
  );

  return (
    <div className="flex flex-col p-8">
      <h1 className="text-3xl font-bold mb-6">Statistic Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {statisticNavItem?.items?.map((item) => (
          <Link key={item.href} href={item.href} className="hover:no-underline">
            <Card className="transition-transform transform hover:scale-105 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                Explore {item.title.toLowerCase()} statistics
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StatisticIntroPage;
