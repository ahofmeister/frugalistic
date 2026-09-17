import Link from "next/link";
import { Suspense } from "react";
import { BudgetList } from "@/app/(dashboard)/budgets/budget-list";
import { MonthYearStepperPeriod } from "@/app/(dashboard)/budgets/monthYearStepperPeriod";
import { Button } from "@/components/ui/button";

export default async function BudgetsPage({
	searchParams,
}: {
	searchParams: Promise<{ month?: string; year?: string }>;
}) {
	const params = await searchParams;
	const now = new Date();
	const year = params.year ? Number(params.year) : now.getFullYear();
	const month = params.month !== undefined ? Number(params.month) : now.getMonth(); // 0-indexed

	return (
		<div className="space-y-6 ">
			<div className="flex justify-between items-center">
				<div className="text-2xl font-semibold">Budgets</div>
				<Link href="/budgets/new">
					<Button>Create</Button>
				</Link>
			</div>

			<MonthYearStepperPeriod />

			<Suspense key={`${year}-${month}`}>
				<BudgetList year={year} month={month} />
			</Suspense>
		</div>
	);
}
