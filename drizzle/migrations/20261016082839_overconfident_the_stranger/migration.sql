ALTER TABLE "setting" ADD COLUMN "due_transaction_reminder_days" integer DEFAULT 14 NOT NULL;--> statement-breakpoint
ALTER TABLE "webhook" ALTER COLUMN "httpMethod" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "webhook" ALTER COLUMN "eventType" SET NOT NULL;