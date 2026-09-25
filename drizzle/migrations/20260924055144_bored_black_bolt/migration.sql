CREATE TYPE "account_role" AS ENUM('owner', 'write', 'read');--> statement-breakpoint
CREATE TABLE "account_member" (
	"account_id" uuid,
	"member_id" uuid,
	"role" "account_role" NOT NULL,
	CONSTRAINT "account_member_pkey" PRIMARY KEY("account_id","member_id")
);
--> statement-breakpoint
ALTER TABLE "account_member" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "datetime" DROP DEFAULT;--> statement-breakpoint
CREATE INDEX "account_member_member_id_idx" ON "account_member" ("member_id");--> statement-breakpoint
ALTER TABLE "account_member" ADD CONSTRAINT "account_fk" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "account_member" ADD CONSTRAINT "profile_id" FOREIGN KEY ("member_id") REFERENCES "profile"("id") ON DELETE CASCADE;--> statement-breakpoint
CREATE POLICY "account member can view their membership" ON "account_member" AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = member_id));--> statement-breakpoint
CREATE POLICY "account owner can add members" ON "account_member" AS PERMISSIVE FOR INSERT TO public WITH CHECK (
				NOT EXISTS (
					SELECT 1 FROM account_member AS am
					WHERE am.account_id = account_member.account_id
				)
				OR EXISTS (
					SELECT 1 FROM account_member AS am
					WHERE am.account_id = account_member.account_id
					AND am.member_id = (SELECT auth.uid())
					AND am.role = 'owner'
				)
			);--> statement-breakpoint
CREATE POLICY "account owner can update members" ON "account_member" AS PERMISSIVE FOR UPDATE TO public USING (EXISTS (
				SELECT 1 FROM account_member AS am
				WHERE am.account_id = account_member.account_id
				AND am.member_id = (SELECT auth.uid())
				AND am.role = 'owner'
			)) WITH CHECK (EXISTS (
				SELECT 1 FROM account_member AS am
				WHERE am.account_id = account_member.account_id
				AND am.member_id = (SELECT auth.uid())
				AND am.role = 'owner'
			));--> statement-breakpoint
CREATE POLICY "account owner can delete members" ON "account_member" AS PERMISSIVE FOR DELETE TO public USING (EXISTS (
				SELECT 1 FROM account_member AS am
				WHERE am.account_id = account_member.account_id
				AND am.member_id = (SELECT auth.uid())
				AND am.role = 'owner'
			));--> statement-breakpoint
CREATE POLICY "account members can view" ON "account" AS PERMISSIVE FOR SELECT TO public USING (EXISTS (
				SELECT 1 FROM account_member AS am
				WHERE am.account_id = account.id
				AND am.member_id = (SELECT auth.uid())
			));--> statement-breakpoint
CREATE POLICY "authenticated users can create accounts" ON "account" AS PERMISSIVE FOR INSERT TO public WITH CHECK ((SELECT auth.uid()) IS NOT NULL);--> statement-breakpoint
CREATE POLICY "account owner can manage account" ON "account" AS PERMISSIVE FOR ALL TO public USING (EXISTS (
				SELECT 1 FROM account_member AS am
				WHERE am.account_id = account.id
				AND am.member_id = (SELECT auth.uid())
				AND am.role = 'owner'
			)) WITH CHECK (EXISTS (
				SELECT 1 FROM account_member AS am
				WHERE am.account_id = account.id
				AND am.member_id = (SELECT auth.uid())
				AND am.role = 'owner'
			));