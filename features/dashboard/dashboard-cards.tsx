import type { SearchParams } from "nuqs/server";
import { loadDashboardParams } from "@/app/(dashboard)/search-params";
import { getActiveAccountId } from "@/features/account/account-actions";
import DashboardCard from "@/features/dashboard/dashboard-card";
import { getPeriodDates } from "@/features/transactions/dates";
import { dbTransaction } from "@/drizzle/client";

const DashboardCards = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
	let income = 0;
	let expense = 0;
	let savings = 0;
	let fixedCosts = 0;

	const awaitedParams = await loadDashboardParams(searchParams);

	const { startDate, endDate } = getPeriodDates(
		awaitedParams.year,
		awaitedParams.month,
		awaitedParams.period,
	);

	const accountId = await getActiveAccountId();

	const transactionsWithCategory = await dbTransaction((tx) => {
		return tx.query.transactions.findMany({
			where: {
				datetime: {
					gte: startDate,
					lte: endDate,
				},
				accountId: accountId,
			},
			orderBy: {
				datetime: "desc",
				createdAt: "desc",
			},
			with: {
				category: true,
			},
		});
	});

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
				<DashboardCard amount={income} type="income" label="Income this period" />
				<DashboardCard amount={savings} type="savings" total={income} ofLabel="income" />
				<DashboardCard
					amount={expense}
					type="expense"
					total={income}
					ofLabel="income"
					fixed={fixedCosts}
				/>
				<DashboardCard amount={leftover} total={income} type="leftover" ofLabel="income left" />
			</div>
		</div>
	);
};

export default DashboardCards;
