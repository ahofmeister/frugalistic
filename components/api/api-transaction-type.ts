import { createInsertSchema } from "drizzle-orm/zod";
import { z } from "zod";
import { transactions } from "@/drizzle/schema";

export const apiTransactionInsertSchema = createInsertSchema(transactions, {
	categoryId: z.uuid().optional(),
	externalId: z.string().min(1).max(255),
}).omit({
	id: true,
	userId: true,
	createdAt: true,
});
