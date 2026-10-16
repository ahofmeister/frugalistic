ALTER TABLE "webhook_event" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "webhook_event" ALTER COLUMN "status_code" SET DATA TYPE integer USING "status_code"::integer;--> statement-breakpoint
ALTER TABLE "webhook_event" ALTER COLUMN "executed_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "webhook_event" ALTER COLUMN "http_method" SET NOT NULL;