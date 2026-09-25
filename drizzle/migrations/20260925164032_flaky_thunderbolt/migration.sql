ALTER TABLE "account" ADD COLUMN "user_id" uuid DEFAULT auth.uid();--> statement-breakpoint
ALTER TABLE "feedback" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "feedback" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "feedback" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "feedback" ALTER COLUMN "created_at" SET NOT NULL;