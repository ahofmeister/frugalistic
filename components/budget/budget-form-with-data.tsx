import BudgetForm from "@/components/budget/budget-form";
import { dbTransaction } from "@/drizzle/client";

const BudgetFormWithData = async () => {
	const categories = await dbTransaction((tx) => {
		return tx.query.categories.findMany({
			orderBy: {
				name: "asc",
			},
		});
	});

	return (
		<div>
			<BudgetForm fetchedCategories={categories} />
		</div>
	);
};

export default BudgetFormWithData;
