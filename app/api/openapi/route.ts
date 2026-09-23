import { z } from "zod";
import { apiTransactionInsertSchema } from "@/components/api/api-transaction-type";

const transactionInsertSchema = apiTransactionInsertSchema.array().min(1).max(500);

export function GET() {
	return Response.json({
		openapi: "3.1.0",
		info: {
			title: "Frugalistic API",
			version: "1.0.0",
		},
		paths: {
			"/api/transactions": {
				post: {
					summary: "Import transactions",
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: z.toJSONSchema(transactionInsertSchema),
							},
						},
					},
					responses: {
						"200": {
							description: "Transactions imported",
						},
						"400": {
							description: "Invalid request",
						},
					},
				},
			},
		},
	});
}
