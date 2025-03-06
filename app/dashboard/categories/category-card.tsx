"use client";
import { useRouter } from "next/navigation";
import React from "react";

import AddCategory from "@/components/categories/add-category";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Category, NewCategory } from "@/types";

export function CategoryCard(props: {
  category: Category | NewCategory;
  exists: boolean;
}) {
  const category = props.category;
  const router = useRouter();
  return (
    <Card
      key={category.name}
      className={cn(props.category.id && "cursor-pointer")}
      onClick={() => {
        if (!props.category.id) {
          return;
        }
        router.push(`/dashboard/categories/edit/${category.id}`);
      }}
      style={{ color: category.color }}
    >
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
        <CardDescription className="text-sm text-gray-200">
          {category?.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        {!props.exists && (
          <div className="flex items-center gap-x-2">
            <AddCategory category={category} />
            <div className="text-xs text-muted-foreground">
              Default category
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
