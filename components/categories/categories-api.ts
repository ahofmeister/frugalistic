"use server";

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { dbTransaction } from "@/drizzle/client";
import { categories } from "@/drizzle/schema";

export async function createCategory(newCategory: typeof categories.$inferInsert) {
	await dbTransaction((tx) => {
		return tx.insert(categories).values(newCategory);
	});

	revalidatePath("categories");
}

export async function deleteCategory(id: string) {
	try {
		await dbTransaction((tx) => {
			return tx.delete(categories).where(eq(categories.id, id));
		});
	} catch (e) {
		console.error(e);
	}

	revalidatePath("categories");
}

export async function getCategories() {
	return dbTransaction((tx) => {
		return tx.select().from(categories).orderBy(asc(categories.name));
	});
}
