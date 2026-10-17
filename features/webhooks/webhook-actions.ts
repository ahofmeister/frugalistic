"use server";
import { randomInt } from "crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuid } from "uuid";
import { db, dbTransaction } from "@/drizzle/client";
import { type transactions, webhookEventSchema, webhookSchema } from "@/drizzle/schema";
import { getActiveAccountId } from "@/features/account/account-actions";
import { generateRandomString } from "@/lib/utils";

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

export async function testWebhook(webhook: typeof webhookSchema.$inferSelect) {
	const accountId = await getActiveAccountId();

	const body = eventTypesTestData.TRANSACTION_DUE;

	await sendWebhook(webhook, body, accountId, true);
}

export async function sendWebhook(
	webhook: typeof webhookSchema.$inferSelect,
	data: Record<string, unknown>,
	accountId: string,
	test: boolean = false,
) {
	const id = uuid();
	const body = {
		id,
		data,
	};

	const result = await fetch(webhook.url, {
		method: webhook.httpMethod,
		body: JSON.stringify(body),
	});

	await db.insert(webhookEventSchema).values({
		id,
		webhookId: webhook.id,
		statusCode: result.status,
		url: webhook.url,
		executedAt: new Date().toISOString(),
		accountId: accountId,
		httpMethod: webhook.httpMethod,
		type: webhook.eventType,
		body,
		test,
	});
	revalidatePath(`/webhooks/${webhook.id}`);
}

type EventTypeKeys = {
	TRANSACTION_DUE: typeof transactions.$inferSelect;
};

const eventTypesTestData: EventTypeKeys = {
	TRANSACTION_DUE: {
		id: uuid(),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		datetime: new Date().toISOString(),
		accountId: uuid(),
		userId: uuid(),
		amount: randomInt(100, 5000),
		description: generateRandomString(),
		categoryId: uuid(),
		type: "expense",
		costType: "variable",
		status: "planned",
		importedAt: new Date().toISOString(),
		recurringTransactionId: uuid(),
		externalId: uuid(),
		dueNotificationDays: randomInt(0, 365),
		webhookId: uuid(),
	},
};
