"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { dbTransaction } from "@/db";
import { favoriteSchema, type TransactionWithRecurringCategory } from "@/db/migrations/schema";
import { createClient } from "@/utils/supabase/server";

export async function addFavorite(transaction: TransactionWithRecurringCategory) {
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
	try {
		await dbTransaction((tx) => {
			return tx.delete(favoriteSchema).where(eq(favoriteSchema.id, id));
		});

		revalidatePath("/", "layout");
		return { success: true };
	} catch (error) {
		console.error("Error removing favorite:", error);
		return { success: false };
	}
}
