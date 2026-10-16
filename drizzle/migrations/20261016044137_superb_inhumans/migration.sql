CREATE TABLE "webhook_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"account_id" uuid DEFAULT public.active_account_id() NOT NULL,
	"webhook_id" uuid NOT NULL,
	"status_code" text NOT NULL,
	"body" jsonb,
	"url" text NOT NULL,
	"executed_at" timestamp with time zone,
	"response_text" text,
	"http_method" text
);
--> statement-breakpoint
ALTER TABLE "webhook_event" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "webhook" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"account_id" uuid DEFAULT public.active_account_id() NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"description" text,
	"httpMethod" text,
	"eventType" text
);
--> statement-breakpoint
ALTER TABLE "webhook" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "webhook_id" uuid;--> statement-breakpoint
CREATE INDEX "webhook_history_account_id_idx" ON "webhook_event" ("account_id");--> statement-breakpoint
CREATE INDEX "webhook_account_id_idx" ON "webhook" ("account_id");--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transactions_webhook_fkey" FOREIGN KEY ("webhook_id") REFERENCES "webhook"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "webhook_event" ADD CONSTRAINT "webhook_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "webhook_event" ADD CONSTRAINT "webhook_id_fkey" FOREIGN KEY ("webhook_id") REFERENCES "webhook"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "webhook" ADD CONSTRAINT "webhook_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE;--> statement-breakpoint
CREATE POLICY "account members can select" ON "webhook_event" AS PERMISSIVE FOR SELECT TO public USING (is_account_member(account_id));--> statement-breakpoint
CREATE POLICY "account write members can manage rows" ON "webhook_event" AS PERMISSIVE FOR ALL TO public USING (is_account_writer(account_id)) WITH CHECK (is_account_writer(account_id));--> statement-breakpoint
CREATE POLICY "account members can select" ON "webhook" AS PERMISSIVE FOR SELECT TO public USING (is_account_member(account_id));--> statement-breakpoint
CREATE POLICY "account write members can manage rows" ON "webhook" AS PERMISSIVE FOR ALL TO public USING (is_account_writer(account_id)) WITH CHECK (is_account_writer(account_id));