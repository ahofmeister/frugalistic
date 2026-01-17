import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable(
	"users",
	{
		id: uuid().primaryKey().notNull(),
		email: text().notNull(),
		emailConfirmedAt: timestamp("email_confirmed_at", {
			withTimezone: true,
			mode: "string",
		}),
		phone: text(),
		phoneConfirmedAt: timestamp("phone_confirmed_at", {
			withTimezone: true,
			mode: "string",
		}),
		confirmedAt: timestamp("confirmed_at", {
			withTimezone: true,
			mode: "string",
		}),
		lastSignInAt: timestamp("last_sign_in_at", {
			withTimezone: true,
			mode: "string",
		}),
		appMetadata: text("app_metadata"),
		userMetadata: text("user_metadata"),
		identities: text(),
		createdAt: timestamp("created_at", {
			withTimezone: true,
			mode: "string",
		}).notNull(),
		updatedAt: timestamp("updated_at", {
			withTimezone: true,
			mode: "string",
		}).notNull(),
	},
	(_table) => [],
);
