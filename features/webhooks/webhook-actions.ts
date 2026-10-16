"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { dbTransaction } from "@/drizzle/client";
import { webhookEventSchema, webhookSchema } from "@/drizzle/schema";

export async function upsertWebhook(webhook: typeof webhookSchema.$inferInsert) {
	try {
		await dbTransaction(async (tx) => {
			if (webhook.id) {
				await tx.update(webhookSchema).set(webhook).where(eq(webhookSchema.id, webhook.id));
			} else {
				await tx.insert(webhookSchema).values(webhook);
			}

			return { success: true };
		});

		revalidatePath("/");
		return { error: null, success: true };
	} catch (error) {
		return { error, success: false };
	}
}

export async function deleteWebhookEvent(id: string) {
	try {
		await dbTransaction(async (tx) => {
			return tx.delete(webhookEventSchema).where(eq(webhookEventSchema.id, id));
		});
		revalidatePath("/", "page");
		return { success: true };
	} catch (error) {
		return { error, success: false };
	}
}
