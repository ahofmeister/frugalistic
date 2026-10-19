ALTER TABLE "webhook_event" ADD COLUMN "error" text;--> statement-breakpoint
ALTER TABLE "webhook_event" ALTER COLUMN "status_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "webhook" ALTER COLUMN "headers" SET DEFAULT '[]';