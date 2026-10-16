import { formatDate, isSameDay, subDays } from "date-fns";
import { and, eq } from "drizzle-orm";
import { db } from "@/drizzle/client";
import { transactions, webhookEventSchema } from "@/drizzle/schema";
import { withCronSecret } from "@/features/api/api-utils";
import { DB_DATE_FORMAT } from "@/lib/utils";

export const GET = withCronSecret(async (_request) => {
	try {
		console.info("Calling due transactions reminder");

		const plannedTransactions = await db.query.transactions.findMany({
			where: {
				status: "planned",
			},
			with: {
				webhook: true,
			},
		});

		const transactionsForNotifying = plannedTransactions.filter((transaction) => {
			const dueNotificationDays = transaction.dueNotificationDays;

			if (!transaction.webhook) {
				return false;
			}

			if (!dueNotificationDays || dueNotificationDays < 0) {
				return false;
			}

			const transactionDate = new Date(transaction.datetime);
			const comparisonDate = subDays(transactionDate, dueNotificationDays);
			const today = new Date();

			return isSameDay(comparisonDate, today);
		});

		for (const transaction of transactionsForNotifying) {
			const webhook = transaction.webhook;

			if (!webhook?.active) {
				continue;
			}

			const result = await fetch(webhook.url, {
				method: webhook.httpMethod,
				body: JSON.stringify({
					transaction,
				}),
			});

			await db.insert(webhookEventSchema).values({
				webhookId: webhook.id,
				statusCode: result.status,
				url: webhook.url,
				executedAt: new Date().toISOString(),
				accountId: transaction.accountId,
				httpMethod: webhook.httpMethod,
				type: webhook.eventType,
			});
		}

		return Response.json(
			{ success: true, transactions: transactionsForNotifying },
			{ status: 200 },
		);
	} catch (error) {
		console.error(error);
		return Response.json({ success: false, message: "Fatal error occurred" }, { status: 500 });
	}
});
