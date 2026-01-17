import { relations } from "drizzle-orm/relations";
import { users } from "@/db/migrations/auth-schema";
import {
	categories,
	favoriteSchema,
	feedback,
	profile,
	setting,
	transactionSchema,
	transactionsRecurring,
} from "./schema";

export const favoriteRelations = relations(favoriteSchema, ({ one }) => ({
	category: one(categories, {
		fields: [favoriteSchema.category],
		references: [categories.id],
	}),
	users: one(users, {
		fields: [favoriteSchema.userId],
		references: [users.id],
	}),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	favorites: many(favoriteSchema),
	users: one(users, {
		fields: [categories.userId],
		references: [users.id],
	}),
	transactions: many(transactionSchema),
	transactionsRecurrings: many(transactionsRecurring),
}));

export const usersRelations = relations(users, ({ many }) => ({
	favorites: many(favoriteSchema),
	categories: many(categories),
	transactions: many(transactionSchema),
	transactionsRecurrings: many(transactionsRecurring),
	settings: many(setting),
	feedbacks: many(feedback),
	profiles: many(profile),
}));

export const transactionsRelations = relations(
	transactionSchema,
	({ one }) => ({
		category: one(categories, {
			fields: [transactionSchema.category],
			references: [categories.id],
		}),
		transactionsRecurring: one(transactionsRecurring, {
			fields: [transactionSchema.recurringTransaction],
			references: [transactionsRecurring.id],
		}),
		users: one(users, {
			fields: [transactionSchema.userId],
			references: [users.id],
		}),
	}),
);

export const transactionsRecurringRelations = relations(
	transactionsRecurring,
	({ one, many }) => ({
		transactions: many(transactionSchema),
		category: one(categories, {
			fields: [transactionsRecurring.category],
			references: [categories.id],
		}),
		users: one(users, {
			fields: [transactionsRecurring.userId],
			references: [users.id],
		}),
	}),
);

export const settingRelations = relations(setting, ({ one }) => ({
	users: one(users, {
		fields: [setting.userId],
		references: [users.id],
	}),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
	users: one(users, {
		fields: [feedback.userId],
		references: [users.id],
	}),
}));

export const profileRelations = relations(profile, ({ one }) => ({
	users: one(users, {
		fields: [profile.id],
		references: [users.id],
	}),
}));
