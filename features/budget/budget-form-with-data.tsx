import BudgetForm from "@/features/budget/budget-form";
import { getCategories } from "@/features/categories/categories-api";

const BudgetFormWithData = async () => {
	const categories = await getCategories();
	return (
		<div>
			<BudgetForm fetchedCategories={categories} />
		</div>
	);
};

export default BudgetFormWithData;
