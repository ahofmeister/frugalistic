import { format } from "date-fns";
import Link from "next/link";
import React from "react";

import DashboardCards from "@/components/dashboard/dashboard-cards";
import DashboardCategories from "@/components/dashboard/dashboard-categories";
import DashboardDivisions from "@/components/dashboard/dashboard-divisions";
import DashboardTransactions from "@/components/dashboard/dashboard-transactions";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();

  return (
    <div className="flex-col">
      <div className="flex gap-5 my-5 justify-between">
        <div className="font-bold text-3xl">{format(date, " yyyy MMMM")}</div>
        <Link href="/transactions/new">
          <Button>New Transaction</Button>
        </Link>
      </div>

      <div className="h-72 flex gap-5 mb-10 justify-between">
        <div className="flex gap-5 flex-wrap">
          <DashboardCards month={month} year={year} />
          <DashboardDivisions month={month} year={year} />
          <DashboardCategories month={month} year={year} />
        </div>
      </div>

      <div className="mt-6">
        <DashboardTransactions />
      </div>
    </div>
  );
}
