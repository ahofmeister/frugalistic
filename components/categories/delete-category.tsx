"use client";
import { deleteCategory } from "@/components/categories/categories-api";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";

const DeleteCategory = ({ category }: { category: Category }) => (
  <Button
    className="w-full"
    variant="destructive"
    onClick={() => deleteCategory(category.id)}
  >
    Delete Category
  </Button>
);

export default DeleteCategory;
