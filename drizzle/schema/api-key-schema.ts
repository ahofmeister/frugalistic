import { sql } from "drizzle-orm";
import {
	boolean,
	foreignKey,
	index,
	pgPolicy,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { profiles } from "@/drizzle/schema/profile-schema";
import { createdAt, id, userId } from "@/drizzle/schema/schema-commons";

export const apiKeySchema = pgTable(
	"api_key",
	{
		id,
		userId,
		name: text("name").notNull(),
		keyPrefix: text("key_prefix").notNull(),
		keyHash: text("key_hash").notNull().unique(),
		lastUsedAt: timestamp("last_used_at", { withTimezone: true, mode: "string" }),
		expiresAt: timestamp("expires_at", { withTimezone: true, mode: "string" }),
		revoked: boolean("revoked").notNull().default(false),
		createdAt,
	},
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "api_keys_user_id_fkey",
		}).onDelete("cascade"),
		index("api_keys_user_id_idx").on(table.userId),
		pgPolicy("user's api keys only", {
			as: "permissive",
			for: "all",
			to: ["public"],
			using: sql`(auth.uid() = user_id)`,
			withCheck: sql`(auth.uid() = user_id)`,
		}),
	],
);
