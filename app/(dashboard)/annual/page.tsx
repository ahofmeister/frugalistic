import { Suspense } from "react";
import YearComparison from "@/components/year-comparison";

const AnnualPage = () => {
	return (
		<div>
			<Suspense>
				<YearComparison />
			</Suspense>
		</div>
	);
};

export default AnnualPage;
