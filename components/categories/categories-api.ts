"use server";

import { revalidatePath } from "next/cache";

import { Category, DefaultCategory, Division } from "@/types";
import { TablesInsert } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";

export async function createCategory(formData: FormData) {
  const rawFormData = {
    name: formData.get("name") as string,
    color: formData.get("color") as string,
    division: formData.get("division") as Division,
  };

  const categoryInsert: TablesInsert<"categories"> = {
    name: rawFormData.name,
    color: rawFormData.color,
    division: rawFormData.division,
  };

  await createClient().from("categories").insert(categoryInsert);

  revalidatePath("/categories");
}

export async function getCategories() {
  const { data } = await createClient()
    .from("categories")
    .select("*")
    .order("name", { ascending: true })
    .returns<Category[]>();

  return data ?? [];
}

export async function deleteCategory(id: string) {
  await createClient().from("categories").delete().eq("id", id);
  revalidatePath("categories");
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
