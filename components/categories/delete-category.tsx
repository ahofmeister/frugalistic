"use client";
import { deleteCategory } from "@/components/categories/categories-api";
import { Category } from "@/types";
import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

const DeleteCategory = ({ category }: { category: Category }) => (
  <Button variant={"destructive"} onClick={() => deleteCategory(category.id)}>
    <TrashIcon />
  </Button>
);

export default DeleteCategory;
