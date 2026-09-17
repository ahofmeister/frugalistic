ALTER TABLE "budget" ALTER COLUMN "amount" SET DATA TYPE integer USING "amount"::integer;--> statement-breakpoint
ALTER TABLE "budget" ALTER COLUMN "start_date" SET NOT NULL;