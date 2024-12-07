"use server";

import { revalidateTag } from "next/cache";

import { DefaultCategory, NewCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function createCategory(newCategory: NewCategory) {
  const supabase = await createClient("category");

  await supabase.from("categories").insert(newCategory);

  revalidateTag("category");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient("category");
  await supabase.from("categories").delete().eq("id", id);
  revalidateTag("category");
}

export const insertCategoriesFromDefaultCategories = async (
  categories: DefaultCategory[],
) => {
  const categoriesForInsert = categories.map(({ name, color, division }) => ({
    name,
    color,
    division,
  }));

  const supabase = await createClient("category");
  const { error } = await supabase
    .from("categories")
    .insert(categoriesForInsert);

  if (error) {
    console.log(error);
  }
  revalidateTag("categories");
};
