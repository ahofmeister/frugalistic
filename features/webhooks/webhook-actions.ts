"use server";
import { randomInt } from "node:crypto";
import { formatISO } from "date-fns";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuid } from "uuid";
import { db, dbTransaction } from "@/drizzle/client";
import { type transactions, webhookEventSchema, webhookSchema } from "@/drizzle/schema";
import { getActiveAccountId } from "@/features/account/account-actions";
import type { ActionResult } from "@/features/errors/error-types";
import { generateRandomString } from "@/lib/utils";

export async function getActiveWebhooks() {
	const activeAccountId = await getActiveAccountId();

	return await dbTransaction((tx) => {
		return tx.query.webhookSchema.findMany({
			where: {
				accountId: activeAccountId,
				active: true,
			},
		});
	});
}

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

export type WebhookErrorCode = "webhook_timeout" | "webhook_unreachable" | "webhook_rejected";

type DeliveryOutcome = {
	statusCode: number | null;
	code: WebhookErrorCode | null;
	detail: string | null;
};

const methodsWithoutBody = ["GET", "HEAD"];

function buildHeaders(webhook: typeof webhookSchema.$inferSelect): Record<string, string> {
	const custom = Object.fromEntries(
		(webhook.headers ?? [])
			.filter((header) => header.key.trim() !== "")
			.map((header) => [header.key.trim(), header.value]),
	);

	return {
		"Content-Type": "application/json",
		...custom,
	};
}

async function deliverWebhook(
	webhook: typeof webhookSchema.$inferSelect,
	body: Record<string, unknown>,
): Promise<DeliveryOutcome> {
	try {
		const response = await fetch(webhook.url, {
			method: webhook.httpMethod,
			headers: buildHeaders(webhook),
			body: methodsWithoutBody.includes(webhook.httpMethod.toUpperCase())
				? undefined
				: JSON.stringify(body),
			signal: AbortSignal.timeout(10_000),
			redirect: "manual",
		});

		if (!response.ok) {
			return {
				statusCode: response.status,
				code: "webhook_rejected",
				detail: `Receiver responded with status ${response.status}`,
			};
		}

		return { statusCode: response.status, code: null, detail: null };
	} catch (error) {
		const isTimeout = error instanceof DOMException && error.name === "TimeoutError";

		return {
			statusCode: null,
			code: isTimeout ? "webhook_timeout" : "webhook_unreachable",
			detail: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function sendWebhook(
	webhook: typeof webhookSchema.$inferSelect,
	data: Record<string, unknown>,
	accountId: string,
	test: boolean = false,
): Promise<ActionResult<{ statusCode: number }, WebhookErrorCode>> {
	const id = uuid();
	const body = { id, data };

	const outcome = await deliverWebhook(webhook, body);

	await db.insert(webhookEventSchema).values({
		id,
		webhookId: webhook.id,
		statusCode: outcome.statusCode,
		error: outcome.detail,
		url: webhook.url,
		executedAt: formatISO(new Date()),
		accountId,
		httpMethod: webhook.httpMethod,
		type: webhook.eventType,
		body,
		test,
	});

	revalidatePath(`/webhooks/${webhook.id}`);

	if (outcome.code) {
		return { success: false, code: outcome.code };
	}

	return { success: true, data: { statusCode: outcome.statusCode as number } };
}

export async function testWebhook(webhook: typeof webhookSchema.$inferSelect) {
	const accountId = await getActiveAccountId();

	return sendWebhook(webhook, eventTypesTestData.TRANSACTION_DUE, accountId, true);
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
