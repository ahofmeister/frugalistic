import React from "react";

import CategoryList from "@/app/dashboard/categories/category-list";
import CategoryForm from "@/components/categories/category-form";

export default function CategoriesPage() {
  return (
    <div className="space-y-6 px-4">
      <div className="text-2xl font-semibold text-gray-100">
        Create Category
      </div>
      <CategoryForm />

      <CategoryList />
    </div>
  );
}
