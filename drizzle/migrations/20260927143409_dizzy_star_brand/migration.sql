DROP VIEW "transaction_auto_suggest";--> statement-breakpoint

CREATE OR REPLACE FUNCTION is_account_owner(target_account_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
SELECT EXISTS (
    SELECT 1 FROM account
    WHERE id = target_account_id
      AND user_id = auth.uid()
)
           $$;--> statement-breakpoint

CREATE OR REPLACE FUNCTION is_account_member(target_account_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
SELECT
    is_account_owner(target_account_id)
        OR EXISTS (
        SELECT 1 FROM account_member
        WHERE account_id = target_account_id
          AND member_id = auth.uid()
    )
        $$;--> statement-breakpoint

CREATE OR REPLACE FUNCTION is_account_writer(target_account_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
SELECT
    is_account_owner(target_account_id)
        OR EXISTS (
        SELECT 1 FROM account_member
        WHERE account_id = target_account_id
          AND member_id = auth.uid()
          AND role = 'write'
    )
        $$;--> statement-breakpoint

ALTER POLICY "account member can view their membership" ON "account_member" TO public USING (member_id = (SELECT auth.uid()) OR is_account_member(account_id));--> statement-breakpoint
ALTER POLICY "account owner can add members" ON "account_member" TO public WITH CHECK (is_account_owner(account_id));--> statement-breakpoint
ALTER POLICY "account owner can update members" ON "account_member" TO public USING (is_account_owner(account_id)) WITH CHECK (is_account_owner(account_id));--> statement-breakpoint
ALTER POLICY "account owner can delete members" ON "account_member" TO public USING (is_account_owner(account_id));--> statement-breakpoint
ALTER POLICY "account members can view" ON "account" TO public USING (is_account_member(id));--> statement-breakpoint
ALTER POLICY "account owner can manage account" ON "account" TO public USING (is_account_owner(id)) WITH CHECK (is_account_owner(id));--> statement-breakpoint
ALTER POLICY "account members can select" ON "categories" TO public USING (is_account_member(account_id));--> statement-breakpoint
ALTER POLICY "account write members can manage rows" ON "categories" TO public USING (is_account_writer(account_id)) WITH CHECK (is_account_writer(account_id));--> statement-breakpoint
ALTER POLICY "account members can select" ON "favorite" TO public USING (is_account_member(account_id));--> statement-breakpoint
ALTER POLICY "account write members can manage rows" ON "favorite" TO public USING (is_account_writer(account_id)) WITH CHECK (is_account_writer(account_id));--> statement-breakpoint
ALTER POLICY "account members can select" ON "transactions_recurring" TO public USING (is_account_member(account_id));--> statement-breakpoint
ALTER POLICY "account write members can manage rows" ON "transactions_recurring" TO public USING (is_account_writer(account_id)) WITH CHECK (is_account_writer(account_id));--> statement-breakpoint
ALTER POLICY "account members can select" ON "transactions" TO public USING (is_account_member(account_id));--> statement-breakpoint
ALTER POLICY "account write members can manage rows" ON "transactions" TO public USING (is_account_writer(account_id)) WITH CHECK (is_account_writer(account_id));--> statement-breakpoint

ALTER TABLE "account_invitation" ALTER COLUMN "account_role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "account_member" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "account_role";--> statement-breakpoint
CREATE TYPE "account_role" AS ENUM('read', 'write');--> statement-breakpoint
UPDATE "account_invitation" SET "account_role" = 'write' WHERE "account_role" = 'owner';--> statement-breakpoint
UPDATE "account_member" SET "role" = 'write' WHERE "role" = 'owner';--> statement-breakpoint
ALTER TABLE "account_invitation" ALTER COLUMN "account_role" SET DATA TYPE "account_role" USING "account_role"::"account_role";--> statement-breakpoint
ALTER TABLE "account_member" ALTER COLUMN "role" SET DATA TYPE "account_role" USING "role"::"account_role";--> statement-breakpoint
ALTER TABLE "account_member" ALTER COLUMN "role" SET DATA TYPE text USING "role"::text;--> statement-breakpoint
ALTER TABLE "account_member" ADD CONSTRAINT "account_member_role_check" CHECK (role = ANY (ARRAY['read', 'write']));--> statement-breakpoint

ALTER TABLE "favorite" DROP CONSTRAINT "disallow_empty", ADD CONSTRAINT "disallow_empty" CHECK ((description)
			    ::text <> ''::text);--> statement-breakpoint
ALTER TABLE "transactions_recurring" DROP CONSTRAINT "disallow_empty", ADD CONSTRAINT "disallow_empty" CHECK ((description)
			    ::text <> ''::text);--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "disallow_empty", ADD CONSTRAINT "disallow_empty" CHECK ((description)
			    ::text <> ''::text);--> statement-breakpoint

CREATE VIEW "transaction_auto_suggest" WITH (security_invoker = true) AS (WITH category_counts
AS (SELECT TRIM(BOTH FROM t_1.description) AS description,
    t_1.type,
    c.id                            AS category,
    c.name,
    c.color,
    count(*)                        AS frequency,
    row_number()                       OVER (PARTITION BY (TRIM(BOTH FROM t_1.description)), t_1.type ORDER BY (count(*)) DESC) AS rn
    FROM transactions t_1
    JOIN categories c ON c.id = t_1.category_id
    GROUP BY (TRIM(BOTH FROM t_1.description)), t_1.type, c.id,
    c.name, c.color),
    totals AS (SELECT category_counts.description,
    category_counts.type,
    sum(category_counts.frequency) AS total_frequency
    FROM category_counts
    GROUP BY category_counts.description, category_counts.type)
    SELECT row_number()         OVER (ORDER BY t.total_frequency DESC, cc.description) AS unique_id, cc.description,
    cc.type,
    cc.category,
    cc.name,
    cc.color,
    t.total_frequency AS frequency
    FROM category_counts cc
    JOIN totals t ON cc.description = t.description AND cc.type = t.type
    WHERE cc.rn = 1
    ORDER BY t.total_frequency DESC, cc.description);