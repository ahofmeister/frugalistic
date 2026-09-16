"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { dbTransaction } from "@/drizzle/client";
import { budgetSchema } from "@/drizzle/schema";

export async function createBudget(newCategory: typeof budgetSchema.$inferInsert) {
	await dbTransaction((tx) => {
		return tx.insert(budgetSchema).values(newCategory);
	});

	revalidatePath("budgets");
}

export async function deleteBudget(id: string) {
	try {
		await dbTransaction((tx) => {
			return tx.delete(budgetSchema).where(eq(budgetSchema.id, id));
		});
	} catch (e) {
		console.error(e);
	}

	revalidatePath("budgets");
}
