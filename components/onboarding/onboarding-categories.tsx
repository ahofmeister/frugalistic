"use client";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";

import { Card, CardContent } from "@/components/ui/card";
import { DefaultCategory } from "@/types";
import { createClient } from "@/utils/supabase/client";

const OnboardingCategories = ({
  selectedCategories,
  onSelectCategory,
}: {
  selectedCategories: DefaultCategory[];
  onSelectCategory: (categories: DefaultCategory[]) => void;
}) => {
  const toggleCategory = (toggledCategory: DefaultCategory) => {
    const isSelected = selectedCategories.some(
      (category) => category.id === toggledCategory.id,
    );

    const updatedCategories = isSelected
      ? selectedCategories.filter(
          (category) => category.id !== toggledCategory.id,
        )
      : [...selectedCategories, toggledCategory];

    onSelectCategory(updatedCategories);
  };

  const { data: categories } = useQuery(
    createClient()
      .from("default_categories")
      .select()
      .order("name", { ascending: false })
      .returns<DefaultCategory[]>(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  return (
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Choose Your Categories
      </h1>
      <div className="grid grid-cols-4 md:grid-cols-4 gap-4 mb-8">
        {categories?.map((category) => (
          <Card
            style={{ backgroundColor: category.color }}
            key={category.id}
            className={`cursor-pointer transition-all  ${
              selectedCategories.includes(category) ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => toggleCategory(category)}
          >
            <CardContent className="flex items-center justify-center h-32">
              <h2 className="text-lg font-semibold text-center">
                {category.name}
              </h2>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center space-x-4"></div>
    </div>
  );
};

export default OnboardingCategories;
