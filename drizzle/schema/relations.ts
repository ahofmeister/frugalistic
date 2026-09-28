import { defineRelations } from "drizzle-orm";
import * as schema from "./index";

export const relations = defineRelations(schema, (r) => ({
	users: {
		favorites: r.many.favoriteSchema(),
		categories: r.many.categories(),
		transactions: r.many.transactions(),
		recurringTransactions: r.many.transactionsRecurring(),
		settings: r.many.settingSchema(),
		feedbacks: r.many.feedback(),
		profiles: r.many.profiles({
			from: r.users.id,
			to: r.profiles.id,
		}),
	},

	profiles: {
		user: r.one.users({
			from: r.profiles.id,
			to: r.users.id,
		}),

		accountMemberships: r.many.accountMemberSchema({
			from: r.profiles.id,
			to: r.accountMemberSchema.memberId,
		}),

		account: r.many.accountSchema({
			from: r.profiles.id,
			to: r.accountSchema.userId,
		}),
	},

	accountSchema: {
		members: r.many.accountMemberSchema(),
		categories: r.many.categories(),
		transactions: r.many.transactions(),
		budgets: r.many.budgetSchema(),
		recurringTransactions: r.many.transactionsRecurring(),
		favorites: r.many.favoriteSchema(),
		owner: r.one.profiles({
			from: r.accountSchema.userId,
			to: r.profiles.id,
		}),
	},

	accountMemberSchema: {
		account: r.one.accountSchema({
			from: r.accountMemberSchema.accountId,
			to: r.accountSchema.id,
			optional: false,
		}),

		member: r.one.profiles({
			from: r.accountMemberSchema.memberId,
			to: r.profiles.id,
			optional: false,
		}),
	},

	categories: {
		user: r.one.users({
			from: r.categories.userId,
			to: r.users.id,
		}),

		account: r.one.accountSchema({
			from: r.categories.accountId,
			to: r.accountSchema.id,
			optional: false,
		}),

		favorites: r.many.favoriteSchema(),
		transactions: r.many.transactions(),
		recurringTransactions: r.many.transactionsRecurring(),
	},

	favoriteSchema: {
		user: r.one.users({
			from: r.favoriteSchema.userId,
			to: r.users.id,
		}),

		account: r.one.accountSchema({
			from: r.favoriteSchema.accountId,
			to: r.accountSchema.id,
			optional: false,
		}),

		category: r.one.categories({
			from: r.favoriteSchema.categoryId,
			to: r.categories.id,
			optional: false,
		}),
	},

	transactions: {
		user: r.one.users({
			from: r.transactions.userId,
			to: r.users.id,
		}),

		account: r.one.accountSchema({
			from: r.transactions.accountId,
			to: r.accountSchema.id,
			optional: false,
		}),

		category: r.one.categories({
			from: r.transactions.categoryId,
			to: r.categories.id,
			optional: false,
		}),

		recurringTransaction: r.one.transactionsRecurring({
			from: r.transactions.recurringTransactionId,
			to: r.transactionsRecurring.id,
		}),
	},

	transactionsRecurring: {
		user: r.one.users({
			from: r.transactionsRecurring.userId,
			to: r.users.id,
		}),

		account: r.one.accountSchema({
			from: r.transactionsRecurring.accountId,
			to: r.accountSchema.id,
			optional: false,
		}),

		category: r.one.categories({
			from: r.transactionsRecurring.categoryId,
			to: r.categories.id,
			optional: false,
		}),

		transactions: r.many.transactions(),
	},

	settingSchema: {
		user: r.one.users({
			from: r.settingSchema.userId,
			to: r.users.id,
		}),
	},

	feedback: {
		user: r.one.users({
			from: r.feedback.userId,
			to: r.users.id,
		}),
	},

	budgetSchema: {
		account: r.one.accountSchema({
			from: r.budgetSchema.accountId,
			to: r.accountSchema.id,
			optional: false,
		}),

		category: r.one.categories({
			from: r.budgetSchema.categoryId,
			to: r.categories.id,
			optional: false,
		}),
	},
}));
