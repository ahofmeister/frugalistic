"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

const MonthYearDashboard = () => {
  const searchParams = useSearchParams();
  const queryParams = new URLSearchParams(searchParams);
  const path = usePathname();
  const router = useRouter();
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    if (queryParams.get("month")) {
      setMonth(Number(queryParams.get("month")));
    }

    if (queryParams.get("year")) {
      setYear(Number(queryParams.get("year")));
    }
  }, [queryParams, searchParams]);

  useEffect(() => {
    if (!queryParams.get("month")) {
      const currentMonth = new Date().getMonth();
      setMonth(currentMonth);
      setSearchParam(queryParams, "month", currentMonth.toString());
    }
    if (!queryParams.get("year")) {
      const currentYear = new Date().getFullYear();
      setYear(currentYear);
      setSearchParam(queryParams, "year", currentYear.toString());
    }
    router.push(`${path}?${queryParams.toString()}`);
  }, []);

  return (
    <div className="flex gap-5 ">
      <div
        className="cursor-pointer"
        onClick={() => {
          setSearchParam(queryParams, "month", (month - 1).toString());
          router.push(`${path}?${queryParams.toString()}`);
        }}
      >
        <div className="w-8 h-8">
          <ChevronLeftIcon style={{ width: "100%", height: "100%" }} />
        </div>
      </div>

      <div
        className="cursor-pointer"
        onClick={() => {
          setSearchParam(queryParams, "month", (month + 1).toString());
          router.push(`${path}?${queryParams.toString()}`);
        }}
      >
        <div className="w-8 h-8">
          <ChevronRightIcon style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
    </div>
  );
};

export default MonthYearDashboard;
