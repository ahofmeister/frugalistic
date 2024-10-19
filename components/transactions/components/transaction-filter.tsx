"use client";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DATE_FROM_QUERY_PARAM = "dateFrom";
const DATE_TO_QUERY_PARAM = "dateTo";
const CATEGORY_QUERY_PARAM = "category";

const setSearchParam = (
  queryParams: URLSearchParams,
  key: string,
  value: string,
) => {
  if (!value) {
    queryParams.delete(key);
  } else {
    queryParams.set(key, value);
  }
};

const TransactionFilter = () => {
  const searchParams = useSearchParams();
  const queryParams = new URLSearchParams(searchParams);
  const path = usePathname();
  const router = useRouter();

  const [dateTo, setDateTo] = useState<Date>();

  useEffect(() => {
    const dateToQueryParam = queryParams.get(DATE_TO_QUERY_PARAM);
    if (dateToQueryParam) {
      const date = new Date(dateToQueryParam);
      if (date.getTime() !== dateTo?.getTime()) {
        setDateTo(date);
      }
    } else {
      setDateTo(undefined);
    }
  }, [searchParams, dateTo]);

  return (
    <div className="flex gap-10">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !dateTo && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateTo ? format(dateTo, "yyyy-MM-dd") : <span>Filter to</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={dateTo}
            onSelect={(value) => {
              setDateTo(value);
              if (value) {
                setSearchParam(
                  queryParams,
                  DATE_TO_QUERY_PARAM,
                  format(value, "yyyy-MM-dd"),
                );
                const href = `${path}?${queryParams.toString()}`;
                router.push(href);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TransactionFilter;
