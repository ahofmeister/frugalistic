import { sql } from "drizzle-orm";
import {
	foreignKey,
	index,
	jsonb,
	pgPolicy,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { accountSchema } from "@/drizzle/schema/account-schema";
import { accountId, createdAt, id, updatedAt } from "@/drizzle/schema/schema-commons";
import {
	type WebhookHTTPMethod,
	webhookHTTPMethods,
	webhookSchema,
} from "@/drizzle/schema/webhook-schema";

export const webhookEventSchema = pgTable(
	"webhook_event",
	{
		id,
		createdAt,
		updatedAt,
		accountId,
		webhookId: uuid("webhook_id").notNull(),
		statusCode: text("status_code").notNull(),
		body: jsonb(),
		url: text().notNull(),
		executedAt: timestamp("executed_at", {
			mode: "string",
			withTimezone: true,
		}),
		responseText: text("response_text"),
		httpMethod: text("http_method", { enum: webhookHTTPMethods }).$type<WebhookHTTPMethod>(),
	},
	(table) => [
		index("webhook_history_account_id_idx").on(table.accountId),
		foreignKey({
			columns: [table.accountId],
			foreignColumns: [accountSchema.id],
			name: "webhook_account_id_fkey",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.webhookId],
			foreignColumns: [webhookSchema.id],
			name: "webhook_id_fkey",
		}).onDelete("cascade"),
		pgPolicy("account members can select", {
			as: "permissive",
			for: "select",
			to: ["public"],
			using: sql`is_account_member(account_id)`,
		}),
		pgPolicy("account write members can manage rows", {
			as: "permissive",
			for: "all",
			to: ["public"],
			using: sql`is_account_writer(account_id)`,
			withCheck: sql`is_account_writer(account_id)`,
		}),
	],
);
