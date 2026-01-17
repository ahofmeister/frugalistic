ALTER TABLE "transactions"
    ADD COLUMN "cost_type" text DEFAULT 'variable' NOT NULL;--> statement-breakpoint

ALTER TABLE "transactions"
    ADD CONSTRAINT "cost_type_check" CHECK ("transactions"."cost_type"
                                                IN ('fixed', 'variable') OR
                                            "transactions"."cost_type" IS NULL);--> statement-breakpoint