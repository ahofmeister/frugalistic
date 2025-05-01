"use server";
import { revalidatePath } from "next/cache";

import { TransactionWithRecurring } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function addFavorite(transaction: TransactionWithRecurring) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("favorite").upsert({
    category: transaction.category,
    description: transaction.description,
    amount: transaction.amount,
    type: transaction.type,
  });

  if (error) {
    console.log(error);
    return;
  }
  revalidatePath("/", "layout");
  return data;
}

export async function removeFavorite(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("favorite").delete().eq("id", id);

  if (error) {
    console.log(error);
    return;
  }
  revalidatePath("/", "layout");
  return data;
}
