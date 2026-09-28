DROP POLICY "User can manage their budgets" ON "budget";--> statement-breakpoint
ALTER TABLE "budget" ADD CONSTRAINT "budget_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE;--> statement-breakpoint
CREATE POLICY "account members can select" ON "budget" AS PERMISSIVE FOR SELECT TO public USING (is_account_member(account_id));--> statement-breakpoint
CREATE POLICY "account write members can manage rows" ON "budget" AS PERMISSIVE FOR ALL TO public USING (is_account_writer(account_id)) WITH CHECK (is_account_writer(account_id));