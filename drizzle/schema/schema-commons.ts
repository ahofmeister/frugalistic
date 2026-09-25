import { sql } from "drizzle-orm";
import { timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "@/drizzle/schema/profile-schema";

export const id = uuid().defaultRandom().primaryKey().notNull();

export const createdAt = timestamp("created_at", {
	mode: "string",
	withTimezone: true,
})
	.notNull()
	.defaultNow();

export const updatedAt = timestamp("updated_at", {
	mode: "string",
	withTimezone: true,
})
	.notNull()
	.defaultNow()
	.$onUpdate(() => new Date().toISOString());

export const userId = uuid("user_id")
	.default(sql`auth.uid()`)
	.notNull()
	.references(() => profiles.id);

export const accountId = uuid("account_id").default(sql`public.active_account_id()`).notNull();
