DROP POLICY "user's categories" ON "categories";--> statement-breakpoint
DROP POLICY "User can see favorites" ON "favorite";--> statement-breakpoint
DROP POLICY "Allow users to delete their own entries" ON "transactions_recurring";--> statement-breakpoint
DROP POLICY "Allow users to insert a new entry" ON "transactions_recurring";--> statement-breakpoint
DROP POLICY "Allow users to read their own entries" ON "transactions_recurring";--> statement-breakpoint
DROP POLICY "Allow users to update their own entries" ON "transactions_recurring";--> statement-breakpoint
DROP POLICY "user's transaction only" ON "transactions";--> statement-breakpoint
CREATE INDEX "budget_account_id_idx" ON "budget" ("account_id");--> statement-breakpoint
CREATE INDEX "categories_account_id_idx" ON "categories" ("account_id");--> statement-breakpoint
CREATE INDEX "transactions_account_id_idx" ON "transactions" ("account_id");--> statement-breakpoint
CREATE POLICY "account members can select" ON "categories" AS PERMISSIVE FOR SELECT TO public USING (EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = categories.account_id
				AND account_member.member_id = (SELECT auth.uid())
			));--> statement-breakpoint
CREATE POLICY "account write members can manage rows" ON "categories" AS PERMISSIVE FOR ALL TO public USING (EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = categories.account_id
				AND account_member.member_id = (SELECT auth.uid())
				AND account_member.role IN ('owner', 'write')
			)) WITH CHECK (EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = categories.account_id
				AND account_member.member_id = (SELECT auth.uid())
				AND account_member.role IN ('owner', 'write')
			));--> statement-breakpoint
CREATE POLICY "account members can select" ON "favorite" AS PERMISSIVE FOR SELECT TO public USING (EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = favorite.account_id
				AND account_member.member_id = (SELECT auth.uid())
			));--> statement-breakpoint
CREATE POLICY "account write members can manage rows" ON "favorite" AS PERMISSIVE FOR ALL TO public USING (EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = favorite.account_id
				AND account_member.member_id = (SELECT auth.uid())
				AND account_member.role IN ('owner', 'write')
			)) WITH CHECK (EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = favorite.account_id
				AND account_member.member_id = (SELECT auth.uid())
				AND account_member.role IN ('owner', 'write')
			));--> statement-breakpoint
CREATE POLICY "account members can select" ON "transactions_recurring" AS PERMISSIVE FOR SELECT TO public USING (EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = transactions_recurring.account_id
				AND account_member.member_id = (SELECT auth.uid())
			));--> statement-breakpoint
CREATE POLICY "account write members can manage rows" ON "transactions_recurring" AS PERMISSIVE FOR ALL TO public USING (EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = transactions_recurring.account_id
				AND account_member.member_id = (SELECT auth.uid())
				AND account_member.role IN ('owner', 'write')
			)) WITH CHECK (EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = transactions_recurring.account_id
				AND account_member.member_id = (SELECT auth.uid())
				AND account_member.role IN ('owner', 'write')
			));--> statement-breakpoint
CREATE POLICY "account members can select" ON "transactions" AS PERMISSIVE FOR SELECT TO public USING (EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = transactions.account_id
				AND account_member.member_id = (SELECT auth.uid())
			));--> statement-breakpoint
CREATE POLICY "account write members can manage rows" ON "transactions" AS PERMISSIVE FOR ALL TO public USING (EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = transactions.account_id
				AND account_member.member_id = (SELECT auth.uid())
				AND account_member.role IN ('owner', 'write')
			)) WITH CHECK (EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.account_id = transactions.account_id
				AND account_member.member_id = (SELECT auth.uid())
				AND account_member.role IN ('owner', 'write')
			));