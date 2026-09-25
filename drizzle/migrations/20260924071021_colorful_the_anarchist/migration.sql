ALTER TABLE "budget" ADD COLUMN "account_id" uuid;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "account_id" uuid;--> statement-breakpoint
ALTER TABLE "favorite" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "favorite" ADD COLUMN "account_id" uuid;--> statement-breakpoint
ALTER TABLE "transactions_recurring" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions_recurring" ADD COLUMN "account_id" uuid;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "account_id" uuid;--> statement-breakpoint
ALTER TABLE "favorite" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "favorite_account_id_idx" ON "favorite" ("account_id");--> statement-breakpoint
CREATE INDEX "transactions_recurring_account_id_idx" ON "transactions_recurring" ("account_id");--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "categories_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id");