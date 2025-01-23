import React from "react";

import { CategoryCard } from "@/app/dashboard/categories/category-card";
import { defaultCategories } from "@/app/dashboard/categories/default-categories";
import { Category, NewCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";

const CategoryList = async () => {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  const existingCategories = categories?.map((category) => category.name) || [];

  const orderedCategories: (Category | NewCategory)[] = [
    ...(categories?.filter((category) =>
      existingCategories.includes(category.name),
    ) || []),
    ...defaultCategories.filter(
      (category) => !existingCategories.includes(category.name),
    ),
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-2">
      {orderedCategories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          exists={existingCategories.includes(category.name)}
        />
      ))}
    </div>
  );
};

export default CategoryList;
