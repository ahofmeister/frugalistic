import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { InsightCategories } from "@/app/(dashboard)/insights/insight-categories";
import { InsightsTotal } from "@/app/(dashboard)/insights/insights-total";
import { InsightsTransactionsTypes } from "@/app/(dashboard)/insights/insightsTransactionsTypes";
import { MinMaxSelectYear } from "@/app/(dashboard)/insights/minMaxSelectYear";
import { TransactionCategoryDistribution } from "@/app/(dashboard)/insights/transactionCategoryDistribution";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { transactionTypes } from "@/lib/transaction-types";

const InsightsPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex gap-x-4 justify-between items-center">
				<Suspense>
					<div className="text-2xl">
						Insights of{" "}
						{searchParams.then((param) => (
							<span>{param.year ?? new Date().getFullYear()}</span>
						))}
					</div>
					<MinMaxSelectYear />
				</Suspense>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-min">
				{transactionTypes.map((type) => (
					<div key={type}>
						<Suspense
							fallback={
								<Card>
									<CardHeader>
										<CardTitle>
											<Skeleton className="h-7 w-10" />
										</CardTitle>
										<div className={"flex gap-x-2 items-center"}>
											<Skeleton className="h-4 w-16" />
											<Skeleton className="h-4 w-20" />
										</div>
									</CardHeader>
									<CardContent>
										<Skeleton className="h-4 w-36" />
									</CardContent>
									<CardFooter>
										<div className="flex gap-x-1 items-center">
											<Skeleton className="h-4 w-32" />
											<Skeleton className="h-4 w-16" />
										</div>
									</CardFooter>
								</Card>
							}
						>
							<InsightsTotal searchParams={searchParams} type={type} />
						</Suspense>
					</div>
				))}
			</div>

			<Suspense>
				<InsightCategories searchParams={searchParams} />
			</Suspense>

			<Suspense>
				<InsightsTransactionsTypes searchParams={searchParams} />
			</Suspense>
			<Suspense>
				<TransactionCategoryDistribution searchParams={searchParams} />
			</Suspense>
		</div>
	);
};

export default InsightsPage;
