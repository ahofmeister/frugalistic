CREATE TYPE "cost_type" AS ENUM('fixed', 'variable');--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "cost_type_check";--> statement-breakpoint
ALTER TABLE "setting" ADD COLUMN "import_default_category" uuid;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "external_id" text;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "cost_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "cost_type" SET DATA TYPE "cost_type" USING "cost_type"::"cost_type";--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "cost_type" SET DEFAULT 'variable'::"cost_type";--> statement-breakpoint
CREATE UNIQUE INDEX "transactions_user_external_id_idx" ON "transactions" ("user_id","external_id") WHERE external_id IS NOT NULL;--> statement-breakpoint
ALTER TABLE "setting" ADD CONSTRAINT "settings_importDefaultCategory_fkey" FOREIGN KEY ("import_default_category") REFERENCES "categories"("id");--> statement-breakpoint
ALTER POLICY "user's transaction only" ON "transactions" TO public USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));