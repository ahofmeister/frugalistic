import { dbTransaction } from "@/drizzle/client";
import type { TransactionType } from "@/drizzle/schema/transaction-schema";
import { getActiveAccountId } from "@/features/account/account-actions";

export interface CategoryRow {
	id: string;
	name: string;
	color: string;
	amounts: number[];
	type: TransactionType;
}

export interface TotalsRow {
	label: string;
	amounts: number[];
	type: TransactionType;
	percentages?: number[];
}

export async function getRawTransactionsAndCategories() {
	const activeAccountId = await getActiveAccountId();
	const [foundTransactions, foundCategories] = await Promise.all([
		dbTransaction((tx) =>
			tx.query.transactions.findMany({
				where: {
					accountId: activeAccountId,
				},
			}),
		),
		dbTransaction((tx) =>
			tx.query.categories.findMany({
				where: {
					accountId: activeAccountId,
				},
			}),
		),
	]);
	return { transactions: foundTransactions, categories: foundCategories };
}

export function buildComparisonTable(
	transactions: Awaited<ReturnType<typeof getRawTransactionsAndCategories>>["transactions"],
	categories: Awaited<ReturnType<typeof getRawTransactionsAndCategories>>["categories"],
	getKey: (datetime: string) => number | null,
	keys: number[],
): { categories: CategoryRow[]; totals: TotalsRow[] } {
	const pivot: Record<string, { name: string; color: string; years: Record<number, number> }> = {};
	const totals: Record<string, Record<number, number>> = { income: {}, savings: {} };
	const fixedExpenses: Record<number, number> = {};

	categories.forEach((cat) => {
		pivot[cat.id] = { name: cat.name, color: cat.color, years: {} };
	});

	transactions.forEach((transaction) => {
		const { datetime, categoryId, type, amount, costType } = transaction;

		if (!datetime) {
			return;
		}

		const key = getKey(datetime);

		if (key === null) {
			return;
		}

		if (type === "income" || type === "savings") {
			totals[type][key] = (totals[type][key] || 0) + amount;
		}

		if (type === "expense" && categoryId) {
			if (!pivot[categoryId]) pivot[categoryId] = { name: "", color: "", years: {} };
			pivot[categoryId].years[key] = (pivot[categoryId].years[key] || 0) + amount;

			if (costType === "fixed") {
				fixedExpenses[key] = (fixedExpenses[key] || 0) + amount;
			}
		}
	});

	const expenseTotals: Record<number, number> = {};
	Object.values(pivot).forEach((cat) => {
		Object.entries(cat.years).forEach(([k, amount]) => {
			expenseTotals[Number(k)] = (expenseTotals[Number(k)] || 0) + amount;
		});
	});

	const incomeAmounts = keys.map((k) => totals.income[k] || 0);
	const savingsAmounts = keys.map((k) => totals.savings[k] || 0);
	const expenseAmounts = keys.map((k) => expenseTotals[k] || 0);

	const savingsPercentages = savingsAmounts.map((s, i) =>
		incomeAmounts[i] > 0 ? (s / incomeAmounts[i]) * 100 : 0,
	);
	const fixedExpensePercentages = expenseAmounts.map((total, i) => {
		const fixed = fixedExpenses[keys[i]] || 0;
		return total > 0 ? (fixed / total) * 100 : 0;
	});

	const totalsRows: TotalsRow[] = [
		{ label: "Income", amounts: incomeAmounts, type: "income" },
		{ label: "Savings", amounts: savingsAmounts, type: "savings", percentages: savingsPercentages },
		{
			label: "Total Expense",
			amounts: expenseAmounts,
			type: "expense",
			percentages: fixedExpensePercentages,
		},
	];

	const categoryRows: CategoryRow[] = Object.entries(pivot)
		.filter(([, cat]) => Object.keys(cat.years).length > 0)
		.map(([id, cat]) => ({
			id,
			name: cat.name,
			color: cat.color,
			amounts: keys.map((k) => cat.years[k] || 0),
			type: "expense" as TransactionType,
		}))
		.sort((a, b) => a.name.localeCompare(b.name));

	return { categories: categoryRows, totals: totalsRows };
}
