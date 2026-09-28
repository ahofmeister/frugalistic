import { getActiveAccountId } from "@/components/account/account-actions";
import BudgetForm from "@/components/budget/budget-form";
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
