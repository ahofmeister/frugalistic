import { Suspense } from "react";
import BudgetFormWithData from "@/components/budget/budget-form-with-data";

const NewBudgetPage = () => {
	return (
		<Suspense>
			<BudgetFormWithData />
		</Suspense>
	);
};

export default NewBudgetPage;
