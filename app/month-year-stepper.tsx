"use client";

import { parseAsString, useQueryState } from "nuqs";
import { parseAsInteger } from "nuqs/server";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { parseMonth } from "@/lib/utils";

export function MonthYearStepper({ amount, icon }: { amount: number; icon: ReactElement }) {
	const [month, setMonth] = useQueryState("month", parseMonth);

	const [year, setYear] = useQueryState(
		"year",
		parseAsInteger.withDefault(new Date().getFullYear()).withOptions({ shallow: false }),
	);

	const [period] = useQueryState(
		"period",
		parseAsString.withDefault("month").withOptions({ shallow: false }),
	);

	const handleStep = () => {
		let nextMonth: number | null = month;
		let nextYear = year;

		if (period === "month") {
			nextMonth += amount;
			if (nextMonth === 12) {
				nextMonth = 0;
				nextYear += 1;
			} else if (nextMonth === -1) {
				nextMonth = 11;
				nextYear -= 1;
			}
		} else {
			nextYear += amount;
			nextMonth = null;
		}

		void setMonth(nextMonth);
		void setYear(nextYear);
	};

	return (
		<Button size="sm" variant="outline" onClick={handleStep}>
			{icon}
		</Button>
	);
}
