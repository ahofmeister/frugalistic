import { asc, desc } from "drizzle-orm";
import { red } from "next/dist/lib/picocolors";
import { notFound } from "next/navigation";
import TransactionForm from "@/components/transactions/components/transaction-form";
import { dbTransaction } from "@/drizzle/client";
import { transactionAutoSuggest } from "@/drizzle/schema";
import { categories } from "@/drizzle/schema/category-schema";

export const TransactionFormData = async ({
	transactionId,
	redirectNotFound,
}: {
	transactionId?: Promise<string>;
	redirectNotFound?: boolean;
}) => {
	const id = await transactionId;

	const { autoSuggests, categoryList, favorites, transaction } = await dbTransaction(async (tx) => {
		const autoSuggests = await tx
			.select()
			.from(transactionAutoSuggest)
			.orderBy(desc(transactionAutoSuggest.frequency), asc(transactionAutoSuggest.description));

		const categoryList = await tx.select().from(categories).orderBy(asc(categories.name));

		const favorites = await tx.query.favoriteSchema.findMany({
			with: { category: true },
			orderBy: { description: "asc" },
		});

		const [transaction] = id
			? await tx.query.transactions.findMany({
					where: { id: { eq: id } },
					with: {
						recurringTransaction: true,
						category: true,
					},
					limit: 1,
				})
			: [undefined];

		return { autoSuggests, categoryList, favorites, transaction };
	});

	if (!transaction && redirectNotFound) {
		return notFound();
	}

	return (
		<TransactionForm
			transaction={transaction}
			favorites={favorites ?? []}
			autoSuggests={autoSuggests ?? []}
			allCategories={categoryList ?? []}
		/>
	);
};
