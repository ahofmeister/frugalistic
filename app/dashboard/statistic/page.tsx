import { endOfYear, format, startOfYear } from "date-fns";
import Link from "next/link";
import React from "react";

import { TransactionsChart } from "@/app/dashboard/transactions-chart";
import { navConfig } from "@/components/navigation/nav-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";

const StatisticIntroPage = async () => {
  const statisticNavItem = navConfig.dashboardNavigation.find(
    (item) => item.title === "Statistic",
  );

  const supabase = createClient();
  const { data: transactions = [] } = await supabase
    .from("transactions")
    .select("*")
    .gte("datetime", format(startOfYear(new Date()), "yyyy-MM-dd"))
    .lte("datetime", format(endOfYear(new Date()), "yyyy-MM-dd"));

  return (
    <div className="flex flex-col">
      <TransactionsChart transactions={transactions ?? []} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mt-4">
        {statisticNavItem?.items?.map((item) => (
          <Link key={item.href} href={item.href} className="hover:no-underline">
            <Card>
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
