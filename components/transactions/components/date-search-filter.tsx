"use client";
import React, { useEffect, useState } from "react";
import useUpdateQueryParams from "@/app/useUpdateQueryParams";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useRouter, useSearchParams } from "next/navigation";
import { router } from "next/client";

const DateSearchFilter = (props: {
  paramName: string;
  label: string;
  value?: string;
}) => {
  const [value, setValue] = useState<Date | undefined>(
    props.value ? new Date(props.value) : undefined,
  );

  const updateQueryParams = useUpdateQueryParams();

  useEffect(() => {
    updateQueryParams(
      props.paramName,
      value ? format(value, "yyyy-MM-dd") : "",
    );
  }, [value, updateQueryParams]);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "yyyy-MM-dd") : <span>{props.label}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(value) => {
              setValue(value);
              if (value) {
                updateQueryParams(props.paramName, format(value, "yyyy-MM-dd"));
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateSearchFilter;
