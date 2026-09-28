ALTER POLICY "account member can view their membership" ON "account_member" TO public USING (
				member_id = (SELECT auth.uid())
				OR EXISTS (
					SELECT 1 FROM account_member AS am
					WHERE am.account_id = account_member.account_id
					AND am.member_id = (SELECT auth.uid())
			  	)
			);