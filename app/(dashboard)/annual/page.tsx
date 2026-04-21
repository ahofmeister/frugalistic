import { Suspense } from "react";
import AnnuallyComparison from "@/components/comparison/annual-comparison";

const AnnualPage = () => {
	return (
		<Suspense>
			<AnnuallyComparison />
		</Suspense>
	);
};

export default AnnualPage;
