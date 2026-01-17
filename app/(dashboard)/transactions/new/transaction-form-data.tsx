import { eq } from "drizzle-orm";
import TransactionForm from "@/components/transactions/components/transaction-form";
import { dbTransaction } from "@/db";
import { transactionSchema } from "@/db/migrations/schema";
import type { Category, FavoriteWithCategory } from "@/types";
import { createClient } from "@/utils/supabase/server";

export const TransactionFormData = async ({
	transactionId,
}: {
	transactionId?: Promise<string>;
}) => {
	const supabase = await createClient();

	const id = await transactionId;

	const { data: autoSuggests } = await supabase
		.from("transaction_auto_suggest")
		.select("*")
		.order("frequency", { ascending: false })
		.order("description", { ascending: true });

	const { data: categories } = await supabase
		.from("categories")
		.select("*")
		.order("name")
		.returns<Category[]>();

	const { data: favorites } = await supabase
		.from("favorite")
		.select("*, category(*)")
		.order("description")
		.returns<FavoriteWithCategory[]>();

	const [transaction] = id
		? await dbTransaction(async (tx) => {
				return tx.query.transactionSchema.findMany({
					where: eq(transactionSchema.id, id),
					with: {
						recurringTransaction: true,
						category: true,
					},
					limit: 1,
				});
			})
		: [];

	console.log(transaction);

	return (
		<TransactionForm
			transaction={transaction}
			favorites={favorites ?? []}
			autoSuggests={autoSuggests ?? []}
			categories={categories ?? []}
		/>
	);
};
