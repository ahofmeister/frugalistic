import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { MonthYearStepperPeriod } from "@/app/(dashboard)/budgets/monthYearStepperPeriod";
import { CategoriesBanner } from "@/app/(dashboard)/categories/categories-banner";
import DashboardCards from "@/features/dashboard/dashboard-cards";
import { DashboardCategories } from "@/features/dashboard/dashboard-categories";
import DashboardTransactions from "@/features/dashboard/dashboard-transactions";
import NextRecurringTransactions from "@/features/transactions/recurring/components/next-recurring-transactions";

export default async function DashboardPage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	return (
		<div className={"space-y-4"}>
			<Suspense>
				<CategoriesBanner />
			</Suspense>
			<MonthYearStepperPeriod />

			<Suspense>
				<DashboardCards searchParams={searchParams} />
			</Suspense>
			<Suspense>
				<DashboardCategories searchParams={searchParams} />
			</Suspense>

			<Suspense>
				<NextRecurringTransactions searchParams={searchParams} />
			</Suspense>

			<div className="mt-4">
				<Suspense>
					<DashboardTransactions searchParams={searchParams} />
				</Suspense>
			</div>
		</div>
	);
}
