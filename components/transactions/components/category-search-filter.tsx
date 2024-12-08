"use client";
import React, { useState } from "react";

import useUpdateQueryParam from "@/app/useUpdateQueryParam";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types";

const CATEGORY_ALL_VALUE = "all";

const CategorySearchFilter = (props: {
  categories: Category[];
  value?: string;
}) => {
  const [category, setCategory] = useState<string>(props.value ?? "all");

  const updateQueryParams = useUpdateQueryParam();

  return (
    <div>
      <Select
        value={category}
        onValueChange={(value) => {
          if (value == CATEGORY_ALL_VALUE) {
            updateQueryParams({ key: "category", value: null });
          } else {
            updateQueryParams({ key: "category", value });
          }

          setCategory(value);
        }}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={CATEGORY_ALL_VALUE}>All</SelectItem>
          {props.categories?.map((category) => (
            <SelectItem key={category.id} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySearchFilter;
