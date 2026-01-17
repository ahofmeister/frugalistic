import { and, desc, eq, gte, lte } from "drizzle-orm";
import type { DashboardParams } from "@/app/(dashboard)/dashboard/page";
import { loadSearchParams } from "@/app/(dashboard)/search-params";
import DashboardCard from "@/components/dashboard/dashboard-card";
import { dbTransaction } from "@/db";
import { categories, transactionSchema } from "@/db/migrations/schema";
import { getPeriodDates } from "@/utils/transaction/dates";

const DashboardCards = async ({
	searchParams,
}: {
	searchParams: Promise<DashboardParams>;
}) => {
	let income = 0;
	let expense = 0;
	let savings = 0;
	let fixedCosts = 0;
	let _variableCosts = 0;

	const awaitedParams = await loadSearchParams(searchParams);

	const { startDate, endDate } = getPeriodDates(
		awaitedParams.year,
		awaitedParams.month,
		awaitedParams.period,
	);

	const fetchedTransactions = await dbTransaction((tx) => {
		return tx
			.select()
			.from(transactionSchema)
			.leftJoin(categories, eq(transactionSchema.category, categories.id))
			.where(
				and(
					gte(transactionSchema.datetime, startDate),
					lte(transactionSchema.datetime, endDate),
				),
			)
			.orderBy(
				desc(transactionSchema.datetime),
				desc(transactionSchema.createdAt),
			);
	});

	const transactionsWithCategory = fetchedTransactions.map((row) => ({
		...row.transactions,
		category: row.categories,
	}));

	transactionsWithCategory?.forEach((transaction) => {
		const amount = transaction.amount;
		switch (transaction.type) {
			case "income":
				income += amount;
				break;
			case "expense":
				expense += amount;
				if (transaction.costType === "fixed") {
					fixedCosts += amount;
				} else if (transaction.costType === "variable") {
					_variableCosts += amount;
				}
				break;
			case "savings":
				savings += amount;
				break;
		}
	});

	const leftover = income - expense - savings;

	return (
		<div className="flex">
			<div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-4 justify-center w-full">
				<DashboardCard
					amount={income}
					type="income"
					label="Income this period"
				/>
				<DashboardCard
					amount={savings}
					type="savings"
					total={income}
					ofLabel="income"
				/>
				<DashboardCard
					amount={expense}
					type="expense"
					total={income}
					ofLabel="income"
					fixed={fixedCosts}
				/>
				<DashboardCard
					amount={leftover}
					total={income}
					type="leftover"
					ofLabel="income left"
				/>
			</div>
		</div>
	);
};

export default DashboardCards;
