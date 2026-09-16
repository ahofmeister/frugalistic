import { ChevronLeft, ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { DashboardDateLabel } from "@/app/(dashboard)/dashboard/dashboard-date-label";
import { MonthYearStepper } from "@/app/month-year-stepper";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { SelectNow } from "@/components/dashboard/select-now";

export function MonthYearStepperPeriod() {
	return (
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
	);
}
