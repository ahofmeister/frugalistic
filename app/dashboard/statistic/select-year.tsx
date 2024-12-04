"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

import useUpdateQueryParams from "@/app/useUpdateQueryParams";
import { Button } from "@/components/ui/button";

const TypeSearchFilter = (props: {
  value?: number;
  min?: number;
  max?: number;
}) => {
  const [year, setYear] = useState<number>(() => {
    const parsedValue = Number(props.value);
    return isNaN(parsedValue) ? new Date().getFullYear() : parsedValue;
  });

  const updateQueryParams = useUpdateQueryParams();

  function handleYearSet(value: number) {
    if (value === new Date().getFullYear()) {
      updateQueryParams("year", null);
    } else {
      updateQueryParams("year", value.toString());
    }

    setYear(value);
  }

  return (
    <div className="flex gap-x-4 items-center">
      <Button
        disabled={props.min !== undefined && year <= props.min}
        variant="outline"
        size="icon"
        onClick={() => handleYearSet(year - 1)}
      >
        <ChevronLeft />
      </Button>
      <div className="font-bold text-xl">{year}</div>
      <Button
        disabled={props.max !== undefined && year >= props.max}
        variant="outline"
        size="icon"
        onClick={() => handleYearSet(year + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default TypeSearchFilter;
