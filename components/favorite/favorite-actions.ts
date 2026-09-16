"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { dbTransaction } from "@/drizzle/client";
import { favoriteSchema } from "@/drizzle/schema";
import type { TransactionWithRecurringCategory } from "@/drizzle/schema/transaction-recurring-schema";

export async function addFavorite(transaction: TransactionWithRecurringCategory) {
	try {
		const [favorite] = await dbTransaction((tx) => {
			return tx
				.insert(favoriteSchema)
				.values({
					category: transaction.category.id,
					description: transaction.description,
					amount: transaction.amount,
					type: transaction.type,
				})
				.returning();
		});

		revalidatePath("/", "layout");

		return favorite;
	} catch (error) {
		console.error("Error adding favorite:", error);
		return;
	}
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
