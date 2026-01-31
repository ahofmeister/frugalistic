import { ChevronLeft, ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { CategoriesBanner } from "@/app/(dashboard)/categories/categories-banner";
import { DashboardDateLabel } from "@/app/(dashboard)/dashboard/dashboard-date-label";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import { DashboardCategories } from "@/components/dashboard/dashboard-categories";
import DashboardTransactions from "@/components/dashboard/dashboard-transactions";
import { type Period, PeriodSelector } from "@/components/dashboard/period-selector";
import { SelectNow } from "@/components/dashboard/select-now";
import { MonthYearStepper } from "../../month-year-stepper";

export type DashboardParams = {
	month: string;
	year: string;
	period: Period;
};

export default async function DashboardPage({
	searchParams,
}: {
	searchParams: Promise<DashboardParams>;
}) {
	return (
		<div className={"space-y-4"}>
			<Suspense>
				<CategoriesBanner />
			</Suspense>
			<div className={"flex-col flex sm:flex-row sm:justify-between gap-4"}>
				<div className="flex font-semibold text-2xl items-center gap-x-4">
					<Suspense>
						<MonthYearStepper amount={-1} icon={<ChevronLeft />} />
						<DashboardDateLabel />
						<MonthYearStepper amount={1} icon={<ChevronRight />} />
					</Suspense>
				</div>

				<Suspense>
					<div className="flex gap-4">
						<div className="flex font-semibold text-xl justify-center gap-x-2">
							<SelectNow />
						</div>
						<PeriodSelector />
					</div>
				</Suspense>
			</div>

			<Suspense>
				<DashboardCards searchParams={searchParams} />
			</Suspense>
			<Suspense>
				<DashboardCategories searchParams={searchParams} />
			</Suspense>

			<div className="mt-4">
				<Suspense>
					<DashboardTransactions searchParams={searchParams} />
				</Suspense>
			</div>
		</div>
	);
}
