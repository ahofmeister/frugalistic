import Link from "next/link";
import React from "react";

import CategoryList from "@/app/dashboard/categories/category-list";
import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
  return (
    <div className="space-y-6 px-4">
      <div className="flex gap-x-4 justify-between">
        <div className="text-2xl font-semibold">Categories</div>
        <Link href="/dashboard/categories/new">
          <Button>Create</Button>
        </Link>
      </div>

      <CategoryList />
    </div>
  );
}
