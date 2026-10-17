import { isSameDay, subDays } from "date-fns";
import { db } from "@/drizzle/client";
import { withCronSecret } from "@/features/api/api-utils";
import { sendWebhook } from "@/features/webhooks/webhook-actions";

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
			await sendWebhook(webhook, transaction, transaction.accountId);
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
