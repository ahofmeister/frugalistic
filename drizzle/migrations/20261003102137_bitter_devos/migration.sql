DROP POLICY "Allow users to delete their own entries" ON "setting";--> statement-breakpoint
DROP POLICY "Allow users to insert a new entry" ON "setting";--> statement-breakpoint
DROP POLICY "Allow users to read their own entries" ON "setting";--> statement-breakpoint
DROP POLICY "Allow users to update their own entries" ON "setting";--> statement-breakpoint
ALTER TABLE "setting" DROP CONSTRAINT "setting_user_id_key";--> statement-breakpoint
ALTER TABLE "setting" ADD COLUMN "account_id" uuid DEFAULT public.active_account_id() NOT NULL;--> statement-breakpoint
ALTER TABLE "setting" ALTER COLUMN "user_id" SET DEFAULT auth.uid();--> statement-breakpoint
ALTER TABLE "setting" ADD CONSTRAINT "setting_user_account_key" UNIQUE("user_id","account_id");--> statement-breakpoint
CREATE INDEX "setting_account_id_idx" ON "setting" ("account_id");--> statement-breakpoint
ALTER TABLE "setting" ADD CONSTRAINT "setting_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "setting" DROP CONSTRAINT "settings_importDefaultCategory_fkey", ADD CONSTRAINT "settings_importDefaultCategory_fkey" FOREIGN KEY ("import_default_category") REFERENCES "categories"("id") ON DELETE SET NULL;--> statement-breakpoint
CREATE POLICY "account members can select" ON "setting" AS PERMISSIVE FOR SELECT TO public USING (is_account_member(account_id));--> statement-breakpoint
CREATE POLICY "account write members can manage rows" ON "setting" AS PERMISSIVE FOR ALL TO public USING (is_account_writer(account_id)) WITH CHECK (is_account_writer(account_id));