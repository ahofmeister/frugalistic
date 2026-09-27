ALTER TABLE "account" DROP CONSTRAINT "account_user_id_profile_id_fkey";--> statement-breakpoint
ALTER TABLE "api_key" DROP CONSTRAINT "api_key_user_id_profile_id_fkey";--> statement-breakpoint
ALTER TABLE "budget" DROP CONSTRAINT "budget_user_id_profile_id_fkey";--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_user_id_profile_id_fkey";--> statement-breakpoint
ALTER TABLE "favorite" DROP CONSTRAINT "favorite_user_id_profile_id_fkey";--> statement-breakpoint
ALTER TABLE "feedback" DROP CONSTRAINT "feedback_user_id_profile_id_fkey";--> statement-breakpoint
ALTER TABLE "transactions_recurring" DROP CONSTRAINT "transactions_recurring_user_id_profile_id_fkey";--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_user_id_profile_id_fkey";