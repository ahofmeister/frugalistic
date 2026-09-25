ALTER TABLE "budget" ALTER COLUMN "account_id" SET DEFAULT public.active_account_id();--> statement-breakpoint
ALTER TABLE "budget" ALTER COLUMN "account_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "account_id" SET DEFAULT public.active_account_id();--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "account_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "favorite" ALTER COLUMN "account_id" SET DEFAULT public.active_account_id();--> statement-breakpoint
ALTER TABLE "favorite" ALTER COLUMN "account_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions_recurring" ALTER COLUMN "account_id" SET DEFAULT public.active_account_id();--> statement-breakpoint
ALTER TABLE "transactions_recurring" ALTER COLUMN "account_id" SET NOT NULL;