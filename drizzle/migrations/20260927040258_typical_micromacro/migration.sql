CREATE TABLE "accountInvitation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"account_id" uuid DEFAULT public.active_account_id() NOT NULL,
	"from_member_id" uuid NOT NULL,
	"to_member_id" uuid NOT NULL,
	"account_role" "account_role" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accountInvitation" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "accountInvitation" ADD CONSTRAINT "accountInvitation_from_member_id_profile_id_fkey" FOREIGN KEY ("from_member_id") REFERENCES "profile"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "accountInvitation" ADD CONSTRAINT "accountInvitation_to_member_id_profile_id_fkey" FOREIGN KEY ("to_member_id") REFERENCES "profile"("id") ON DELETE CASCADE;--> statement-breakpoint
CREATE POLICY "sender can manage invitation" ON "accountInvitation" AS PERMISSIVE FOR ALL TO public USING (auth.uid() = "accountInvitation"."from_member_id") WITH CHECK (auth.uid() = "accountInvitation"."from_member_id");--> statement-breakpoint
CREATE POLICY "recipient can view and respond" ON "accountInvitation" AS PERMISSIVE FOR SELECT TO public USING (auth.uid() = "accountInvitation"."to_member_id" OR auth.uid() = "accountInvitation"."from_member_id");--> statement-breakpoint
CREATE POLICY "recipient can delete to decline" ON "accountInvitation" AS PERMISSIVE FOR DELETE TO public USING (auth.uid() = "accountInvitation"."to_member_id");