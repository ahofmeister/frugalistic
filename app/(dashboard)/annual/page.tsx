import { Suspense } from "react";
import AnnuallyComparison from "@/features/comparison/annual-comparison";

const AnnualPage = () => {
	return (
		<Suspense>
			<AnnuallyComparison />
		</Suspense>
	);
};

export default AnnualPage;
