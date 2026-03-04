import { and, eq, sql } from "drizzle-orm";
import { CategorySpendingChart } from "@/app/(dashboard)/categories/category-spending-chart";
import { dbTransaction } from "@/db";
import { categories, transactionSchema } from "@/db/migrations/schema";

const CategoryAllTimeExpenses = async ({ categoryId }: { categoryId: Promise<string> }) => {
	const id = await categoryId;
	const data = await dbTransaction((tx) =>
		tx
			.select({
				yearMonth: sql<string>`TO_CHAR(${transactionSchema.datetime}, 'YYYY-MM')`,
				categoryName: categories.name,
				categoryColor: categories.color,
				total: sql<number>`SUM(${transactionSchema.amount})::int`,
			})
			.from(transactionSchema)
			.innerJoin(categories, eq(transactionSchema.category, categories.id))
			.where(and(eq(transactionSchema.type, "expense"), eq(transactionSchema.category, id)))
			.groupBy(
				sql`TO_CHAR(${transactionSchema.datetime}, 'YYYY-MM')`,
				categories.name,
				categories.color,
			)
			.orderBy(sql`TO_CHAR(${transactionSchema.datetime}, 'YYYY-MM')`),
	);

	return <CategorySpendingChart data={data} />;
};

export default CategoryAllTimeExpenses;
