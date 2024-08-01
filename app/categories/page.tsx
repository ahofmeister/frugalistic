import { redirect } from "next/navigation";
import React from "react";

import { SubmitButton } from "@/app/login/submit-button";
import {
  createCategory,
  getCategories,
} from "@/components/categories/categories-api";
import DeleteCategory from "@/components/categories/DeleteCategory";
import { Input } from "@/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { createClient } from "@/utils/supabase/server";

export default async function CategoriesPage() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const categories = await getCategories();

  return (
    <>
      <form>
        <div className="flex gap-10 max-w-fit mb-10">
          <Input name="name" placeholder="Name" />

          <Select name="division">
            <SelectTrigger>
              <SelectValue placeholder="Select a division" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="essentials">essentials</SelectItem>
                <SelectItem value="leisure">leisure</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <SubmitButton formAction={createCategory} pendingText="Creating...">
            Create
          </SubmitButton>
        </div>
      </form>

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
                <TableCell className="flex-1">{category.color}</TableCell>
                <TableCell className="flex-1">{category.division}</TableCell>
                <TableCell>
                  <DeleteCategory category={category} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
