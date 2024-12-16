"use client";
import React, { useEffect, useState } from "react";

import useUpdateQueryParam from "@/app/useUpdateQueryParam";
import CategoryColor from "@/components/categories/category-color";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types";
import { createClient } from "@/utils/supabase/client";

const CATEGORY_ALL_VALUE = "all";

const CategorySearchFilter = (props: {
  // categories: Category[];
  value?: string;
}) => {
  const [category, setCategory] = useState<string>(props.value ?? "all");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      setCategories(data ?? []);
    };
    void fetchCategories();
  }, []);

  const updateQueryParams = useUpdateQueryParam();

  return (
    <div>
      <Select
        value={category}
        onValueChange={(value) => {
          if (value == CATEGORY_ALL_VALUE) {
            updateQueryParams({ key: "category", value: undefined });
          } else {
            updateQueryParams({ key: "category", value });
          }

          setCategory(value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={CATEGORY_ALL_VALUE}>Select Category</SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.name}>
              <div className="flex gap-x-2 items-center">
                <CategoryColor color={category.color} />
                {category.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySearchFilter;
