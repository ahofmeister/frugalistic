"use client";
import { deleteCategory } from "@/components/categories/categories-api";
import { Category } from "@/types";

const DeleteCategory = ({ category }: { category: Category }) => (
  <div onClick={() => deleteCategory(category.id)}>Delete</div>
);

export default DeleteCategory;
