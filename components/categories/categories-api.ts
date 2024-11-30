"use server";

import { revalidateTag } from "next/cache";

import { DefaultCategory, NewCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function createCategory(newCategory: NewCategory) {
  await createClient().from("categories").insert(newCategory);

  revalidateTag("categories");
}

export async function deleteCategory(id: string) {
  await createClient().from("categories").delete().eq("id", id);
  revalidateTag("categories");
}

export const insertCategoriesFromDefaultCategories = async (
  categories: DefaultCategory[],
) => {
  const categoriesForInsert = categories.map(({ name, color, division }) => ({
    name,
    color,
    division,
  }));

  const { error } = await createClient()
    .from("categories")
    .insert(categoriesForInsert);

  if (error) {
    console.log(error);
  }
};
