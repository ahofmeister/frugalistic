import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import { AverageAmount } from "@/app/(dashboard)/insights/average-amount";
import type { TransactionType } from "@/drizzle/schema";
import { getTextColor } from "@/features/transactions/colors";
import DisplayAmount from "@/features/transactions/components/display-amount";
import { getYearBoundaries } from "@/features/transactions/dates";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/features/ui/card";
import { capitalize, cn } from "@/lib/utils";

function getMonthsInYear(year: number): number {
	return year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
}

function PercentageChangeFooter({ percentageChange }: { percentageChange: number }) {
	const formattedPercentage = Math.abs(Math.round(percentageChange))
		.toFixed(2)
		.replace(/\.?0+$/, "");

	const isNegative = percentageChange < 0;
	const arrow = isNegative ? <ArrowDown size={20} /> : <ArrowUp size={20} />;

	return (
		<div className="flex gap-x-2 items-center">
			{arrow}
			{formattedPercentage}% from last year
		</div>
	);
}

function InsightsTotalCard(props: {
	year: number;
	type: TransactionType;
	currentYearTotal: number;
	previousYearTotal: number;
}) {
	const type = props.type;
	const currentYearTotal = props.currentYearTotal;
	const previousYearTotal = props.previousYearTotal;
	const year = props.year;

	const percentageChange =
		previousYearTotal && currentYearTotal
			? ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100
			: 0;

	const { startDate, endDate } = getYearBoundaries(year);

	return (
		<Link href={`/transactions?dateFrom=${startDate}&dateTo=${endDate}&type=${type}`}>
			<Card
				className={cn(
					"cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg",
				)}
			>
				<CardHeader>
					<CardTitle className={getTextColor(type)}>{capitalize(type as string)}</CardTitle>
					<DisplayAmount className="text-2xl" amount={currentYearTotal} type={type} />
					{previousYearTotal && previousYearTotal > 0 && (
						<CardDescription>
							<span className="flex gap-x-2">
								Previous:
								<DisplayAmount amount={previousYearTotal} type={type} />
							</span>
						</CardDescription>
					)}
				</CardHeader>
				<CardContent>
					<PercentageChangeFooter percentageChange={percentageChange} />
				</CardContent>
				<CardFooter>
					<AverageAmount amount={currentYearTotal / getMonthsInYear(year)} type={type} />
				</CardFooter>
			</Card>
		</Link>
	);
}

export default InsightsTotalCard;
