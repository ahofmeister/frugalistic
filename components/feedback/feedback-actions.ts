"use server";

import { dbTransaction } from "@/drizzle/client";
import { feedback } from "@/drizzle/schema";

export async function addFeedback(text: string) {
	return dbTransaction((tx) => {
		return tx.insert(feedback).values({ text }).returning();
	});
}
