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
  isEqual,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
  subWeeks,
  subYears,
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
type FilterType = "week" | "month" | "year";

type Preset = {
  type: FilterType;
  label: string;
  from: Date;
  to: Date;
};

export default function Dashboard() {
  const [filterType, setFilterType] = useState<FilterType>("month");
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

  const updateDateRange = (type: FilterType, amount: number) => {
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
    }

    setDateRange({ from, to });
  };

  const dateRangePresets: Preset[] = [
    {
      type: "year",
      label: "This Year",
      from: startOfYear(new Date()),
      to: endOfYear(new Date()),
    },
    {
      type: "month",
      label: "This Month",
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    },
    {
      type: "week",
      label: "This Week",
      from: startOfWeek(new Date()),
      to: endOfWeek(new Date()),
    },
    {
      type: "year",
      label: "Last Year",
      from: startOfYear(subYears(new Date(), 1)),
      to: endOfYear(subYears(new Date(), 1)),
    },
    {
      type: "month",
      label: "Last Month",
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1)),
    },
    {
      type: "week",
      label: "Last Week",
      from: startOfWeek(subWeeks(new Date(), 1)),
      to: endOfWeek(subWeeks(new Date(), 1)),
    },
  ];

  const handlePresetClick = (preset: Preset) => {
    if (preset) {
      setFilterType(preset.type);
      setDateRange({ from: preset.from, to: preset.to });
    }
  };

  const uniqueDateRangePresets = dateRangePresets.filter(
    (preset, index, self) =>
      self.findIndex((p) => p.type === preset.type) === index,
  );

  return (
    <div className="flex flex-col p-4 space-y-4 bg-background text-foreground min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2">
          {/* Date Pickers */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full md:w-[180px] justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  format(dateRange.from, "LLL dd, y")
                ) : (
                  <span>Start date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) =>
                  date && setDateRange({ ...dateRange, from: date })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full md:w-[180px] justify-start text-left font-normal",
                  !dateRange.to && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? (
                  format(dateRange.to, "LLL dd, y")
                ) : (
                  <span>End date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) =>
                  date && setDateRange({ ...dateRange, to: date })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateDateRange(filterType, -1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Select
            value={filterType}
            onValueChange={(type) => setFilterType(type as FilterType)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              {uniqueDateRangePresets.map(({ type }) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateDateRange(filterType, 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dateRangePresets.map((preset) => (
          <Button
            key={preset.label}
            variant={
              isEqual(preset.from, dateRange.from) &&
              isEqual(preset.to, dateRange.to)
                ? "secondary"
                : "outline"
            }
            className="h-auto py-4 justify-start"
            onClick={() => handlePresetClick(preset)}
          >
            <span className="text-left">
              <div className="font-semibold">{preset.label}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {format(preset.from, "MMM d, y")} -{" "}
                {format(preset.to, "MMM d, y")}
              </div>
            </span>
          </Button>
        ))}
      </div>

      {/* Dashboard Content */}
      <DashboardCards transactions={allTransactions ?? []} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCategories transactions={allTransactions ?? []} />
        <DashboardDivisions transactions={allTransactions ?? []} />
      </div>
      <TransactionList transactions={allTransactions ?? []} />
    </div>
  );
}
