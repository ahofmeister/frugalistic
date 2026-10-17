import { sql } from "drizzle-orm";
import { boolean, foreignKey, index, pgPolicy, pgTable, text } from "drizzle-orm/pg-core";
import { v4 as uuid } from "uuid";
import { accountSchema } from "@/drizzle/schema/account-schema";
import { accountId, createdAt, id, updatedAt } from "@/drizzle/schema/schema-commons";

export const webhookHTTPMethods = ["POST", "GET"] as const;
export type WebhookHTTPMethod = (typeof webhookHTTPMethods)[number];

export const webhookEventTypes = ["TRANSACTION_DUE"] as const;
export type WebhookEventType = (typeof webhookEventTypes)[number];

export const webhookSchema = pgTable(
	"webhook",
	{
		id,
		createdAt,
		updatedAt,
		accountId,
		name: text().notNull(),
		url: text().notNull(),
		active: boolean().notNull().default(false),
		description: text(),
		httpMethod: text({ enum: webhookHTTPMethods }).$type<WebhookHTTPMethod>().notNull(),
		eventType: text({ enum: webhookEventTypes }).$type<WebhookEventType>().notNull(),
	},
	(table) => [
		index("webhook_account_id_idx").on(table.accountId),
		foreignKey({
			columns: [table.accountId],
			foreignColumns: [accountSchema.id],
			name: "webhook_account_id_fkey",
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
