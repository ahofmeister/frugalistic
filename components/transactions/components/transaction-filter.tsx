"use client";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import useQueryParams from "@/app/useQueryParams";
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
import { Category } from "@/types";

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

const TransactionFilter = ({ categories }: { categories: Category[] }) => {
  const searchParams = useSearchParams();
  const queryParams = new URLSearchParams(searchParams);
  const path = usePathname();
  const router = useRouter();

  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [category, setCategory] = useState<string>("");

  const { queryParam, setQueryParam } = useQueryParams(CATEGORY_QUERY_PARAM);

  useEffect(() => {
    const dateFromQueryParam = queryParams.get(DATE_FROM_QUERY_PARAM);
    if (dateFromQueryParam) {
      const date = new Date(dateFromQueryParam);
      if (date.getTime() !== dateFrom?.getTime()) {
        setDateFrom(date);
      }
    } else {
      setDateFrom(undefined);
    }
  }, [searchParams, dateFrom, queryParams]);

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

  useEffect(() => {
    setCategory(queryParam);
  }, [queryParam]);

  return (
    <div className="flex gap-10">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !dateFrom && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateFrom ? (
              format(dateFrom, "yyyy-MM-dd")
            ) : (
              <span>Filter from</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={dateFrom}
            onSelect={(value) => {
              setDateFrom(value);
              if (value) {
                setSearchParam(
                  queryParams,
                  DATE_FROM_QUERY_PARAM,
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

      <Select
        value={category}
        onValueChange={(value) => {
          setCategory(value);
          setQueryParam(value);
        }}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories?.map((cat) => (
            <SelectItem key={cat.id} value={cat.name}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TransactionFilter;
