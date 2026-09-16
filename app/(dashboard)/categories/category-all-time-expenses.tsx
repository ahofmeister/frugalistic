import { and, eq, sql } from "drizzle-orm";
import { CategorySpendingChart } from "@/app/(dashboard)/categories/category-spending-chart";
import { dbTransaction } from "@/drizzle/client";
import { categories } from "@/drizzle/schema/categories";
import { transactions } from "@/drizzle/schema/transaction-schema";

const CategoryAllTimeExpenses = async ({ categoryId }: { categoryId: Promise<string> }) => {
	const id = await categoryId;

	const data = await dbTransaction((tx) =>
		tx
			.select({
				yearMonth: sql<string>`TO_CHAR(${transactions.datetime}, 'YYYY-MM')`,
				categoryName: categories.name,
				categoryColor: categories.color,
				total: sql<number>`SUM(${transactions.amount})::int`,
			})
			.from(transactions)
			.innerJoin(categories, eq(transactions.categoryId, categories.id))
			.where(and(eq(transactions.type, "expense"), eq(transactions.categoryId, id)))
			.groupBy(sql`TO_CHAR(${transactions.datetime}, 'YYYY-MM')`, categories.name, categories.color)
			.orderBy(sql`TO_CHAR(${transactions.datetime}, 'YYYY-MM')`),
	);

	return <CategorySpendingChart data={data} />;
};

export default CategoryAllTimeExpenses;
