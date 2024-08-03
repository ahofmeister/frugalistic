"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
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

type MonthsByYear = {
  [year: number]: number[];
};

export default function Dashboard() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: availableMonthYear } = useQuery(
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

  const monthsByYear = groupByYear(availableMonthYear ?? []);

  const getCurrentMonths = () => {
    const months = monthsByYear[year];

    if (months) {
      return months;
    }
    return [];
  };

  return (
    <div className="flex-col">
      <div className="flex gap-5 my-5 justify-between">
        <div className="font-bold text-3xl flex gap-2">
          <Button
            disabled={
              getCurrentMonths().find(
                (currentMonth) => currentMonth - 1 === month - 1,
              ) === undefined
            }
            onClick={() => setMonth(month + -1)}
            variant="outline"
          >
            <ChevronLeftIcon />
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
                {Object.keys(monthsByYear)?.map((year) => (
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
              {getCurrentMonths()?.map((month) => (
                <SelectItem key={month} value={(month - 1).toString()}>
                  {format(new Date(year, month - 1, 1), "MMM")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => setMonth(month + 1)}
            variant="outline"
            disabled={
              getCurrentMonths().find(
                (currentMonth) => currentMonth - 1 === month + 1,
              ) === undefined
            }
          >
            <ChevronRightIcon />
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

function groupByYear(monthYearArray: MonthYear[]): MonthsByYear {
  const result: MonthsByYear = {};

  monthYearArray.forEach(({ month, year }) => {
    if (!result[year]) {
      result[year] = [];
    }
    result[year].push(month);
  });

  return result;
}
