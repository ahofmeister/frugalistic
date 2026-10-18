ALTER TABLE "transactions_recurring" ADD COLUMN "status" text DEFAULT 'booked' NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions_recurring" ADD COLUMN "webhook_id" uuid;--> statement-breakpoint
ALTER TABLE "transactions_recurring" ADD COLUMN "dueNotificationDays" integer;