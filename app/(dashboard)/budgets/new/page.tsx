import { Suspense } from "react";
import BudgetFormWithData from "@/features/budget/budget-form-with-data";

const NewBudgetPage = () => {
	return (
		<Suspense>
			<BudgetFormWithData />
		</Suspense>
	);
};

export default NewBudgetPage;
