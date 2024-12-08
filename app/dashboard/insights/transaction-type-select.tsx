"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

import useUpdateQueryParam from "@/app/useUpdateQueryParam";
import { Button } from "@/components/ui/button";

const TransactionTypeSelect = (props: {
  value?: number;
  min?: number;
  max?: number;
}) => {
  const [year, setYear] = useState<number>(() => {
    const parsedValue = Number(props.value);
    return isNaN(parsedValue) ? new Date().getFullYear() : parsedValue;
  });

  const updateQueryParams = useUpdateQueryParam();

  function handleYearSet(value: number) {
    if (value === new Date().getFullYear()) {
      updateQueryParams({ key: "year", value: undefined });
    } else {
      updateQueryParams({ key: "year", value: value.toString() });
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

export default TransactionTypeSelect;
