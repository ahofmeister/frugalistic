import { Suspense } from "react";
import { MinMaxSelectYear } from "@/app/(dashboard)/insights/minMaxSelectYear";
import MonthlyComparison from "@/components/comparison/monthly-comparison";

const MonthlyPage = ({ searchParams }: { searchParams: Promise<{ year: string }> }) => {
	return (
		<Suspense>
			<div className={"flex flex-col gap-y-4"}>
				<MinMaxSelectYear />
				<MonthlyComparison searchParams={searchParams} />
			</div>
		</Suspense>
	);
};

export default MonthlyPage;
