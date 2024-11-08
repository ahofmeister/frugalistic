"use client";
import React, { useState } from "react";

import useUpdateQueryParams from "@/app/useUpdateQueryParams";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionType } from "@/types";

const TYPE_ALL_VALUE = "all";

const TypeSearchFilter = (props: { value?: TransactionType }) => {
  const [type, setType] = useState<string>(props.value ?? "all");

  const updateQueryParams = useUpdateQueryParams();

  return (
    <div>
      <Select
        value={type}
        onValueChange={(value) => {
          if (value == TYPE_ALL_VALUE) {
            updateQueryParams("type", null);
          } else {
            updateQueryParams("type", value);
          }

          setType(value);
        }}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select a type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TYPE_ALL_VALUE}>All</SelectItem>
          {["expense", "income", "savings"].map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TypeSearchFilter;
