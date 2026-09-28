ALTER TABLE "profile" ADD COLUMN "active_account_id" uuid;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "active_account_id_fkey" FOREIGN KEY ("active_account_id") REFERENCES "account"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER POLICY "user's profile" ON "profile" TO public USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));