import { getActiveAccountId } from "@/features/account/account-actions";
import BudgetForm from "@/features/budget/budget-form";
import { dbTransaction } from "@/drizzle/client";

const BudgetFormWithData = async () => {
	const activeAccountId = await getActiveAccountId();
	const categories = await dbTransaction((tx) => {
		return tx.query.categories.findMany({
			where: {
				accountId: activeAccountId,
			},
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
