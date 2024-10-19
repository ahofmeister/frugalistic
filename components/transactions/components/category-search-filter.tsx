"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types";
import useUpdateQueryParams from "@/app/useUpdateQueryParams";

const CATEGORY_ALL_VALUE = "all";

const CategorySearchFilter = (props: {
  categories: Category[];
  value?: string;
}) => {
  const [category, setCategory] = useState<string>(props.value ?? "all");

  const updateQueryParams = useUpdateQueryParams();

  return (
    <div>
      <Select
        value={category}
        onValueChange={(value) => {
          if (value == CATEGORY_ALL_VALUE) {
            updateQueryParams("category", null);
          } else {
            updateQueryParams("category", value);
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
