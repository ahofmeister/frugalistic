import Link from "next/link";
import { createSearchParamsCache, parseAsInteger } from "nuqs/server";
import { Suspense } from "react";
import { BudgetList } from "@/app/(dashboard)/budgets/budget-list";
import { MonthYearStepperPeriod } from "@/app/(dashboard)/budgets/monthYearStepperPeriod";
import { Button } from "@/components/ui/button";

const searchParamsCache = createSearchParamsCache({
	year: parseAsInteger.withDefault(new Date().getFullYear()),
	month: parseAsInteger.withDefault(new Date().getMonth()),
});

export default function BudgetsPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const parsedSearchParams = searchParamsCache.parse(searchParams);

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div className="text-2xl font-semibold">Budgets</div>
				<Link href="/budgets/new">
					<Button>Create</Button>
				</Link>
			</div>

			<Suspense>
				<MonthYearStepperPeriod />
			</Suspense>

			<Suspense>
				<BudgetList
					yearPromise={parsedSearchParams.then((params) => params.year)}
					monthPromise={parsedSearchParams.then((params) => params.month)}
				/>
			</Suspense>
		</div>
	);
}
