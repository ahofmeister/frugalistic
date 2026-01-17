import Link from "next/link";

import type { Period } from "@/components/dashboard/period-selector";
import { formatAmount } from "@/components/transactions/components/transaction-amount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDateRange } from "@/lib/utils";

export function DashboardCategoryCard({
	category,
	amount,
	fill,
	month,
	year,
	total,
	period,
}: {
	category: string;
	amount: number;
	fill: string;
	month: number;
	year: number;
	total: number;
	period: Period;
}) {
	const { dateFrom, dateTo } = getDateRange(period, year, month);

	return (
		<Link
			href={`/transactions?category=${category}&dateFrom=${dateFrom}&dateTo=${dateTo}&type=expense`}
		>
			<Card style={{ color: fill }}>
				<CardHeader>
					<CardTitle>{category}</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-y-2">
					<div className="flex gap-x-1 items-center">
						<div className="text-lg">{formatAmount(amount)}</div>
					</div>
					<span className="text-sm text-gray-400">
						{`${((amount / total) * 100).toFixed(2)}% of expenses`}
					</span>
				</CardContent>
			</Card>
		</Link>
	);
}
