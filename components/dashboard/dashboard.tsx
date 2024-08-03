"use client";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { format } from "date-fns";
import Link from "next/link";
import React, { useState } from "react";

import DashboardCards from "@/components/dashboard/dashboard-cards";
import DashboardCategories from "@/components/dashboard/dashboard-categories";
import DashboardDivisions from "@/components/dashboard/dashboard-divisions";
import DashboardTransactions from "@/components/dashboard/dashboard-transactions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";

type MonthYear = {
  month: number;
  year: number;
};

export default function Dashboard() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: availableMonth } = useQuery(
    createClient()
      .from("distinct_year_month")
      .select("*")
      .returns<MonthYear[]>(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  console.log(availableMonth);

  return (
    <div className="flex-col">
      <div className="flex gap-5 my-5 justify-between">
        <div className="font-bold text-3xl flex gap-2">
          <Button onClick={() => setMonth(month + -1)} variant="outline">
            {"<"}
          </Button>

          <Select
            onValueChange={(value) => setYear(Number(value))}
            defaultValue={year.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Array.from(
                  new Set(availableMonth?.map((monthYear) => monthYear.year)),
                )?.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={month.toString()}
            onValueChange={(value) => setMonth(Number(value))}
            defaultValue={month.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availableMonth?.map((monthYear) => (
                  <SelectItem
                    key={monthYear.month}
                    value={(monthYear.month - 1).toString()}
                  >
                    {format(new Date(year, monthYear.month - 1, 1), "MMM")}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button onClick={() => setMonth(month + 1)} variant="outline">
            {">"}{" "}
          </Button>
        </div>
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
        <DashboardTransactions month={month} year={year} />
      </div>
    </div>
  );
}
