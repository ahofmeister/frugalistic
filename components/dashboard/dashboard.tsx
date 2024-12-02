"use client";

import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

import DashboardCards from "@/components/dashboard/dashboard-cards";
import { DashboardCategories } from "@/components/dashboard/dashboard-categories";
import {
  TimeFrame,
  TimeFrameSelector,
} from "@/components/dashboard/time-frame-selector";
import TransactionList from "@/components/transactions/components/transaction-list";
import { Button } from "@/components/ui/button";
import { TransactionWithCategory } from "@/types";
import { createClient } from "@/utils/supabase/client";

type DateRange = { from: Date; to: Date };

export default function Dashboard() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("month");
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const now = new Date();
    return {
      from: startOfMonth(now),
      to: endOfMonth(now),
    };
  });

  useEffect(() => {
    if (timeFrame === "year") {
      setDateRange({
        from: startOfYear(dateRange.from),
        to: endOfYear(dateRange.to),
      });
    }

    if (timeFrame === "month") {
      const from = startOfMonth(dateRange.from);
      setDateRange({
        from: from,
        to: endOfMonth(from),
      });
    }
  }, [timeFrame]);

  const { data: allTransactions } = useQuery(
    createClient()
      .from("transactions")
      .select("*, category(*)")
      .gte("datetime", format(dateRange.from, "yyyy-MM-dd"))
      .lte("datetime", format(dateRange.to, "yyyy-MM-dd"))
      .order("datetime", { ascending: false })
      .order("created_at", { ascending: false })
      .returns<TransactionWithCategory[]>(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  function adjustDateRange(number: number) {
    const from = new Date(dateRange.from);
    const to = new Date(dateRange.to);

    const timeAdjusters: Record<string, (date: Date, amount: number) => Date> =
      {
        month: addMonths,
        year: addYears,
        week: (date, amount) => addWeeks(date, amount),
        day: (date, amount) => addDays(date, amount),
      };

    const adjuster = timeAdjusters[timeFrame];
    if (!adjuster) {
      throw new Error(`Unsupported time frame: ${timeFrame}`);
    }

    setDateRange({
      from: adjuster(from, number),
      to: adjuster(to, number),
    });
  }

  function adjustDateRangeToCurrent() {
    switch (timeFrame) {
      case "month":
        setDateRange({
          from: startOfMonth(new Date()),
          to: endOfMonth(new Date()),
        });
        break;
      case "year":
        setDateRange({
          from: startOfYear(new Date()),
          to: endOfYear(new Date()),
        });
        break;
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="min-h-screen">
        <div className="container mx-auto p-0.5">
          <div className="flex font-semibold text-2xl justify-center">
            {timeFrame === "month"
              ? format(dateRange.from, "MMMM yyyy")
              : format(dateRange.from, "yyyy")}
          </div>
          <div className="flex sm:flex-row justify-between items-start sm:items-center mt-2 mb-6 space-y-4 sm:space-y-0">
            <div className="flex space-x-10">
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => adjustDateRange(-1)}>
                  <ChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => adjustDateRangeToCurrent()}
                >
                  Today
                </Button>
                <Button variant="outline" onClick={() => adjustDateRange(1)}>
                  <ChevronRight />
                </Button>
              </div>
            </div>

            <TimeFrameSelector
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
            />
          </div>
          <div className="mb-6">
            <DashboardCards transactions={allTransactions ?? []} />
          </div>
          <div className="flex">
            <DashboardCategories transactions={allTransactions ?? []} />
          </div>
        </div>
        <div className="mt-4">
          <TransactionList transactions={allTransactions ?? []} />
        </div>
      </div>
    </div>
  );
}
