"use server";

import { revalidateTag } from "next/cache";

import { NewCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function createCategory(newCategory: NewCategory) {
  const supabase = await createClient();

  const { error } = await supabase.from("categories").insert(newCategory);
  if (error) {
    console.log(error);
  }

  revalidateTag("category");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidateTag("category");
}
