DROP POLICY "sender can manage invitation" ON "account_invitation";--> statement-breakpoint
DROP POLICY "recipient can view and respond" ON "account_invitation";--> statement-breakpoint
DROP POLICY "Both can delete to decline or withdraw" ON "account_invitation";--> statement-breakpoint
DROP TABLE "account_invitation";--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_key" UNIQUE("user_id");--> statement-breakpoint
CREATE POLICY "account co-members can view each other's profile" ON "profile" AS PERMISSIVE FOR SELECT TO public USING (EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.member_id = profile.id
				AND is_account_member(account_member.account_id)
			));