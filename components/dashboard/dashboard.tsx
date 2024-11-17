"use client";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import {
  addMonths,
  addWeeks,
  addYears,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

import DashboardCards from "@/components/dashboard/dashboard-cards";
import DashboardCategories from "@/components/dashboard/dashboard-categories";
import DashboardDivisions from "@/components/dashboard/dashboard-divisions";
import TransactionList from "@/components/transactions/components/transaction-list";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TransactionWithCategory } from "@/types";
import { createClient } from "@/utils/supabase/client";

type DateRange = { from: Date; to: Date };

export default function Dashboard() {
  const [filterType, setFilterType] = useState("month");
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const now = new Date();
    return {
      from: startOfMonth(now),
      to: endOfMonth(now),
    };
  });

  const { data: allTransactions } = useQuery(
    createClient()
      .from("transactions")
      .select("*, category(*)")
      .gte("datetime", format(dateRange.from, "yyyy-MM-dd"))
      .lte("datetime", format(dateRange.to, "yyyy-MM-dd"))
      .order("datetime", { ascending: false })
      .returns<TransactionWithCategory[]>(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const updateDateRange = (type: string, amount: number) => {
    let from: Date, to: Date;

    switch (type) {
      case "week":
        from = startOfWeek(addWeeks(dateRange.from, amount));
        to = endOfWeek(from);
        break;
      case "month":
        from = startOfMonth(addMonths(dateRange.from, amount));
        to = endOfMonth(from);
        break;
      case "year":
        from = startOfYear(addYears(dateRange.from, amount));
        to = endOfYear(from);
        break;
      default:
        return;
    }

    setDateRange({ from, to });
  };

  return (
    <div className="flex-col p-2">
      <div className="flex gap-x-10 mb-5">
        <div className="flex gap-x-5">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-fit",
                  !dateRange.from && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  format(dateRange.from, "yyyy-MM-dd")
                ) : (
                  <span>Filter from</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(value) => {
                  if (value) {
                    setDateRange({ from: value, to: dateRange.to });
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-fit",
                  !dateRange.to && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? (
                  format(dateRange.to, "yyyy-MM-dd")
                ) : (
                  <span>Filter to</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(value) => {
                  if (value) {
                    setDateRange({ to: value, from: dateRange.from });
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateDateRange(filterType, -1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Select
            value={filterType}
            onValueChange={(type) => {
              setFilterType(type);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateDateRange(filterType, 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex mb-8 gap-x-5">
        <Button
          variant="outline"
          onClick={() => {
            setFilterType("year");
            setDateRange({
              from: startOfYear(new Date()),
              to: endOfYear(new Date()),
            });
          }}
        >
          This year
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            setFilterType("month");
            setDateRange({
              from: startOfMonth(new Date()),
              to: endOfMonth(new Date()),
            });
          }}
        >
          This month
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            setFilterType("week");
            setDateRange({
              from: startOfWeek(new Date()),
              to: endOfWeek(new Date()),
            });
          }}
        >
          This week
        </Button>
      </div>

      <div className="flex mb-10">
        <DashboardCards transactions={allTransactions ?? []} />
      </div>
      <div className="flex gap-10">
        <div className="w-1/2">
          <DashboardCategories transactions={allTransactions ?? []} />
        </div>
        <div className="w-1/2">
          <DashboardDivisions transactions={allTransactions ?? []} />
        </div>
      </div>
      <TransactionList transactions={allTransactions ?? []} />
    </div>
  );
}
