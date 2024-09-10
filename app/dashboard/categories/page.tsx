import React from "react";
import { getCategories } from "@/components/categories/categories-api";
import DeleteCategory from "@/components/categories/delete-category";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CategoryForm from "@/components/categories/category-form";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <div className="min-h-screen p-4">
        <div className="max-w-2xl space-y-6">
          <div className="text-2xl font-bold text-gray-100">
            Create Category
          </div>
          <div className="max-w-md">
            <CategoryForm />
          </div>

          <div className="text-2xl font-semibold text-gray-100">Categories</div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => {
                  return (
                    <TableRow key={category.id}>
                      <TableCell className="flex-1">{category.name}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded-full border"
                            style={{ backgroundColor: category.color! }}
                          />
                          {category.color}
                        </div>
                      </TableCell>
                      <TableCell className="flex-1">
                        {category.division}
                      </TableCell>
                      <TableCell>
                        <DeleteCategory category={category} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
