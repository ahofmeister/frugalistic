"use client";
import React from "react";

import useUpdateQueryParam from "@/app/useUpdateQueryParam";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Transaction } from "@/types";

const SearchSortBy = (props: { sortBy: keyof Transaction | undefined }) => {
  const updateQueryParam = useUpdateQueryParam();

  const handleChange = (value: string) => {
    updateQueryParam({
      key: "sortBy",
      value: value as keyof Transaction,
    });
  };

  const transactionKeys = [
    "amount",
    "datetime",
    "description",
  ] as (keyof Transaction)[];

  return (
    <Select value={props.sortBy} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        {transactionKeys.map((key) => (
          <SelectItem key={key} value={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SearchSortBy;
