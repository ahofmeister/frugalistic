import type { SearchParams } from "nuqs/server";
import { loadDashboardParams } from "@/app/(dashboard)/search-params";
import { DashboardCategoryCard } from "@/components/dashboard/dashboard-category-card";
import { dbTransaction } from "@/drizzle/client";
import { getPeriodDates } from "@/utils/transaction/dates";

interface CategoryData {
	category: string;
	amount: number;
	fill: string;
}

export async function DashboardCategories({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const params = await loadDashboardParams(searchParams);

	const { startDate, endDate } = getPeriodDates(params.year, params.month, params.period);

	const expenses = await dbTransaction((tx) => {
		return tx.query.transactions.findMany({
			where: {
				datetime: {
					gte: startDate,
					lte: endDate,
				},
				type: {
					eq: "expense",
				},
			},
			with: {
				category: true,
			},
			orderBy: {
				datetime: "desc",
				createdAt: "desc",
			},
		});
	});

	const groupedCategories = Object.values(
		expenses.reduce<Record<string, CategoryData>>((acc, transaction) => {
			if (!transaction.category) {
				// TODO fix category not in the json
				console.log(transaction);
			}

			const { name, color } = transaction.category;
			const amount = transaction.amount;

			if (!acc[name]) {
				acc[name] = {
					category: name,
					amount: 0,
					fill: color,
				};
			}

			acc[name].amount += amount;

			return acc;
		}, {}),
	).sort((a, b) => b.amount - a.amount);

	const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);

	if (expenses.length === 0) {
		return null;
	}

	return (
		<div className="w-full">
			<div className="my-2 text-lg">Categories</div>
			<div className="grid grid-cols-2 gap-2 md:grid-cols-4">
				{groupedCategories.map((expense) => (
					<DashboardCategoryCard
						key={expense.category}
						category={expense.category}
						amount={expense.amount}
						fill={expense.fill}
						year={params.year}
						month={params.month}
						total={total}
						period={params.period}
					/>
				))}
			</div>
		</div>
	);
}
