"use client";
import { Plus } from "lucide-react";

import { createCategory } from "@/components/categories/categories-api";
import { Button } from "@/components/ui/button";
import { NewCategory } from "@/types";

const DeleteCategory = ({ category }: { category: NewCategory }) => (
  <Button
    size="icon"
    variant="outline"
    onClick={() => createCategory(category)}
  >
    <Plus />
  </Button>
);

export default DeleteCategory;
