import { Edit2 } from "lucide-react";
import React from "react";

import AddCategory from "@/components/categories/add-category";
import DeleteCategory from "@/components/categories/delete-category";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Category, NewCategory } from "@/types";

export function CategoryCard(props: {
  category: Category | NewCategory;
  exists: boolean;
}) {
  const category = props.category;
  return (
    <Card key={category.name} style={{ color: category.color }}>
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
        <CardDescription className="text-sm text-gray-200">
          {category?.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        {props.exists ? (
          <>
            <Button variant="outline" size="icon" disabled={true}>
              <Edit2 />
            </Button>
            <DeleteCategory category={category as Category} />
          </>
        ) : (
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
