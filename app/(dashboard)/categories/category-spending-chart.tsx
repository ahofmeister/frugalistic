"use client";

import { formatDate } from "date-fns";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { formatAmount } from "@/components/transactions/components/transaction-amount";
import { Card } from "@/components/ui/card";

export type MonthlyCategoryRow = {
	yearMonth: string;
	categoryName: string;
	categoryColor: string;
	total: number;
};

type ChartDataPoint = { yearMonth: string; [category: string]: string | number };
type CategoryMeta = { name: string; color: string };

function transformData(raw: MonthlyCategoryRow[]): {
	chartData: ChartDataPoint[];
	categories: CategoryMeta[];
} {
	const categoryMap = new Map<string, string>();
	const pointMap = new Map<string, Record<string, number>>();

	for (const row of raw) {
		categoryMap.set(row.categoryName, row.categoryColor);

		if (!pointMap.has(row.yearMonth)) {
			pointMap.set(row.yearMonth, {});
		}

		const point = pointMap.get(row.yearMonth);

		if (!point) {
			throw new Error("Unexpected error: point should exist");
		}

		point[row.categoryName] = (point[row.categoryName] ?? 0) + row.total;
	}

	const chartData: ChartDataPoint[] = Array.from(pointMap.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([yearMonth, values]) => ({ yearMonth, ...values }));

	const categories: CategoryMeta[] = Array.from(categoryMap.entries()).map(([name, color]) => ({
		name,
		color,
	}));

	return { chartData, categories };
}

function formatTick(yearMonth: string) {
	const [year, month] = yearMonth.split("-");
	const monthLabel = new Date(Number(year), Number(month) - 1).toLocaleString("default", {
		month: "short",
	});
	return month === "01" ? `${monthLabel} ${year}` : monthLabel;
}

const CustomTooltip = ({
	active,
	payload,
	label,
}: {
	active?: boolean;
	payload?: { name: string; value: number; fill: string }[];
	label?: string;
}) => {
	if (!active || !payload?.length) {
		return null;
	}

	const [year, month] = (label ?? "").split("-");
	const dateLabel = formatDate(new Date(Number(year), Number(month) - 1), "MMMM yyyy");

	return (
		<Card>
			<p className="text-muted-foreground text-xs font-semibold uppercase mb-2">{dateLabel}</p>
			{payload
				.filter((p) => p.value > 0)
				.sort((a, b) => b.value - a.value)
				.map((p) => (
					<div key={p.name} className="flex items-center justify-between gap-6 mb-1">
						<span className="text-foreground text-xs font-semibold">{formatAmount(p.value)}</span>
					</div>
				))}
		</Card>
	);
};

export function CategorySpendingChart({ data }: { data: MonthlyCategoryRow[] }) {
	const { chartData, categories } = transformData(data);

	if (!categories.length) {
		return (
			<div className="bg-card border border-border rounded-xl p-6 h-[360px] flex items-center justify-center text-muted-foreground text-sm">
				No expense data available
			</div>
		);
	}

	return (
		<Card>
			<div className="mb-6">
				<h2 className="text-foreground text-base font-semibold tracking-tight">
					All-time monthly breakdown
				</h2>
				<p className="text-muted-foreground text-sm">
					You have spent a total {formatAmount(data.reduce((sum, row) => sum + row.total, 0))}
				</p>
			</div>

			<ResponsiveContainer width="100%" height={320}>
				<BarChart
					data={chartData}
					margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
					barCategoryGap="20%"
				>
					<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
					<XAxis
						dataKey="yearMonth"
						tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
						axisLine={false}
						tickLine={false}
						tickFormatter={formatTick}
						interval="preserveStartEnd"
					/>
					<YAxis
						tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
						axisLine={false}
						tickLine={false}
						width={52}
						tickFormatter={(v) => {
							const euros = v / 100;
							return euros >= 1000 ? `${(euros / 1000).toFixed(0)}k` : String(euros);
						}}
					/>
					<Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
					<Legend
						wrapperStyle={{ paddingTop: 20 }}
						iconType="circle"
						iconSize={8}
						formatter={(value) => <span className="text-muted-foreground text-xs">{value}</span>}
					/>
					{categories.map((cat, i) => (
						<Bar
							key={cat.name}
							dataKey={cat.name}
							stackId="a"
							fill={cat.color}
							radius={i === categories.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
						/>
					))}
				</BarChart>
			</ResponsiveContainer>
		</Card>
	);
}
