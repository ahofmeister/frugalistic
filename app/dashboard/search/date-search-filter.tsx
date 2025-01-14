"use client";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

import useUpdateQueryParam from "@/app/useUpdateQueryParam";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DateSearchFilter = (props: {
  paramName: string;
  label: string;
  value?: string;
}) => {
  const [value, setValue] = useState<Date | undefined>(
    props.value ? new Date(props.value) : undefined,
  );

  const updateQueryParams = useUpdateQueryParam();

  useEffect(() => {
    updateQueryParams({
      key: props.paramName,
      value: value ? format(value, "yyyy-MM-dd") : "",
    });
  }, [value]);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
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
                updateQueryParams({
                  key: props.paramName,
                  value: format(value, "yyyy-MM-dd"),
                });
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
