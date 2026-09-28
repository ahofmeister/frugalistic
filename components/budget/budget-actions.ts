"use server";

import { endOfMonth, endOfYear, format, parseISO, startOfMonth, startOfYear } from "date-fns";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getActiveAccountId } from "@/components/account/account-actions";
import { dbTransaction } from "@/drizzle/client";
import { budgetSchema } from "@/drizzle/schema";

function normalizeBudgetDates(
	type: typeof budgetSchema.$inferInsert.type,
	startDate: string,
	targetDate?: string | null,
) {
	const start = parseISO(startDate);

	if (type === "month") {
		return {
			startDate: format(startOfMonth(start), "yyyy-MM-dd"),
			targetDate: targetDate ? format(endOfMonth(parseISO(targetDate)), "yyyy-MM-dd") : null,
		};
	}

	if (type === "year") {
		return {
			startDate: format(startOfYear(start), "yyyy-MM-dd"),
			targetDate: targetDate ? format(endOfYear(parseISO(targetDate)), "yyyy-MM-dd") : null,
		};
	}

	return {
		startDate,
		targetDate,
	};
}

export async function createBudget(newBudget: typeof budgetSchema.$inferInsert) {
	const dates = normalizeBudgetDates(newBudget.type, newBudget.startDate, newBudget.targetDate);

	await dbTransaction((tx) => {
		return tx.insert(budgetSchema).values({
			...newBudget,
			...dates,
			amount: newBudget.amount * 100,
		});
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

export async function findBudgetById(budgetId: string) {
	const activeAccountId = await getActiveAccountId();

	return await dbTransaction((tx) => {
		return tx.query.budgetSchema.findFirst({
			where: {
				id: budgetId,
				accountId: activeAccountId,
			},
			with: {
				category: true,
			},
		});
	});
}
