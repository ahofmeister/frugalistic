"use server";
import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";
import { dbTransaction } from "@/db";
import {
  favoriteSchema,
  TransactionWithRecurringCategory,
} from "@/db/migrations/schema";
import { eq } from "drizzle-orm";

export async function addFavorite(
  transaction: TransactionWithRecurringCategory,
) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("favorite").insert({
    category: transaction.category?.id,
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
  await dbTransaction((tx) => {
    return tx.delete(favoriteSchema).where(eq(favoriteSchema.id, id));
  });

  revalidatePath("/", "layout");
}
