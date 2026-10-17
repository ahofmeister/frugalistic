import { addMonths, differenceInCalendarMonths, format, formatDate, parseISO } from "date-fns";
import { and, eq, isNotNull, lte } from "drizzle-orm";
import { db } from "@/drizzle/client";
import { transactionsRecurring } from "@/drizzle/schema/transaction-recurring-schema";
import { transactions } from "@/drizzle/schema/transaction-schema";
import { withCronSecret } from "@/features/api/api-utils";
import { DB_DATE_FORMAT } from "@/lib/utils";

export const GET = withCronSecret(async (_request) => {
	try {
		console.info("Calling insert recurring transactions");

		const today = formatDate(new Date(), DB_DATE_FORMAT);

		await db.transaction(async (tx) => {
			const dueRecurringTransactions = await tx
				.select()
				.from(transactionsRecurring)
				.where(
					and(
						eq(transactionsRecurring.enabled, true),
						isNotNull(transactionsRecurring.nextRun),
						lte(transactionsRecurring.nextRun, today),
					),
				)
				.for("update", { skipLocked: true });

			console.info(`Found ${dueRecurringTransactions.length} transactions`);

			for (const recurringTransaction of dueRecurringTransactions) {
				if (!recurringTransaction.nextRun) {
					continue;
				}

				await tx.insert(transactions).values({
					userId: recurringTransaction.userId,
					accountId: recurringTransaction.accountId,
					description: recurringTransaction.description,
					datetime: recurringTransaction.nextRun,
					amount: recurringTransaction.amount,
					type: recurringTransaction.type,
					categoryId: recurringTransaction.categoryId,
					recurringTransactionId: recurringTransaction.id,
					costType: "fixed",
				});

				const startDate = parseISO(recurringTransaction.startDate);

				const stepMonths = recurringTransaction.interval === "monthly" ? 1 : 12;

				const monthsSinceStart = differenceInCalendarMonths(
					parseISO(recurringTransaction.nextRun),
					startDate,
				);

				await tx
					.update(transactionsRecurring)
					.set({
						nextRun: format(addMonths(startDate, monthsSinceStart + stepMonths), DB_DATE_FORMAT),
					})
					.where(eq(transactionsRecurring.id, recurringTransaction.id));
			}

			console.info("Finished recurring transactions inserted");
		});

		return Response.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error(error);
		return Response.json({ success: false, message: "Fatal error occurred" }, { status: 500 });
	}
});
