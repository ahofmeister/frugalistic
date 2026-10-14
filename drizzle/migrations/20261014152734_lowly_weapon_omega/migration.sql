UPDATE "transaction" SET status = 'booked' where status is null;
ALTER TABLE "transaction" ALTER COLUMN "status" SET DEFAULT 'booked';--> statement-breakpoint
ALTER TABLE "transaction" ALTER COLUMN "status" SET NOT NULL;