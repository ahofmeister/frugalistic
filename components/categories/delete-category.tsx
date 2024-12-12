"use client";
import { TrashIcon } from "@radix-ui/react-icons";

import { deleteCategory } from "@/components/categories/categories-api";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";

const DeleteCategory = ({ category }: { category: Category }) => (
  <Button
    variant="outline"
    className="text-destructive"
    size="icon"
    onClick={() => deleteCategory(category.id)}
  >
    <TrashIcon />
  </Button>
);

export default DeleteCategory;
