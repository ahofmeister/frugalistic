set local check_function_bodies = off;
--> statement-breakpoint
grant usage on schema public to anon, authenticated, service_role;
--> statement-breakpoint
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
--> statement-breakpoint
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
--> statement-breakpoint
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.active_account_id()
 RETURNS uuid
 LANGUAGE sql
 STABLE
AS $function$
select active_account_id from profile where id = auth.uid()
    $function$
;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.create_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
new_account_id uuid;
BEGIN
INSERT INTO public.account (user_id, name)
VALUES (NEW.id, 'Personal')
    RETURNING id INTO new_account_id;

INSERT INTO public.profile (id, email, active_account_id)
VALUES (NEW.id, NEW.email, new_account_id);

INSERT INTO public.account_member (account_id, member_id, role)
VALUES (new_account_id, NEW.id, 'write');

RETURN NEW;
END;
$function$
;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.delete_user()
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
	--delete from public.profiles where id = auth.uid();
delete from auth.users where id = auth.uid();
$function$
;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.is_account_member(target_account_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
SELECT
    is_account_owner(target_account_id)
        OR EXISTS (
        SELECT 1 FROM account_member
        WHERE account_id = target_account_id
          AND member_id = auth.uid()
    )
        $function$
;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.is_account_owner(target_account_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
SELECT EXISTS (
    SELECT 1 FROM account
    WHERE id = target_account_id
      AND user_id = auth.uid()
)
$function$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.is_account_writer(target_account_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
SELECT
    is_account_owner(target_account_id)
        OR EXISTS (
        SELECT 1 FROM account_member
        WHERE account_id = target_account_id
          AND member_id = auth.uid()
          AND role = 'write'
    )
        $function$
;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.verify_user_password(password text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
user_id uuid;
BEGIN
  user_id := auth.uid();
RETURN EXISTS (
    SELECT id
    FROM auth.users
    WHERE id = user_id AND encrypted_password = crypt(password::text, auth.users.encrypted_password)
);
END;
$function$;
--> statement-breakpoint

CREATE TYPE "account_role" AS ENUM('read', 'write');--> statement-breakpoint
CREATE TYPE "cost_type" AS ENUM('fixed', 'variable');--> statement-breakpoint
CREATE TYPE "transaction_type" AS ENUM('income', 'expense', 'savings');--> statement-breakpoint
CREATE TABLE "account_member" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"account_id" uuid,
	"member_id" uuid,
	"role" text NOT NULL,
	CONSTRAINT "account_member_pkey" PRIMARY KEY("account_id","member_id"),
	CONSTRAINT "account_member_role_check" CHECK (role = ANY (ARRAY['read', 'write']))
);
--> statement-breakpoint
ALTER TABLE "account_member" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL CONSTRAINT "account_user_id_key" UNIQUE,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "api_key" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"name" text NOT NULL,
	"key_prefix" text NOT NULL,
	"key_hash" text NOT NULL UNIQUE,
	"last_used_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"revoked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "api_key" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "budget" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"account_id" uuid DEFAULT public.active_account_id() NOT NULL,
	"name" text,
	"category_id" uuid NOT NULL,
	"period" text NOT NULL,
	"amount" integer NOT NULL,
	"flow" text NOT NULL,
	"repeating" text,
	"start_date" date NOT NULL,
	"target_date" date
);
--> statement-breakpoint
ALTER TABLE "budget" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"account_id" uuid DEFAULT public.active_account_id() NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"description" text,
	"icon" text
);
--> statement-breakpoint
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "favorite" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"account_id" uuid DEFAULT public.active_account_id() NOT NULL,
	"description" varchar NOT NULL,
	"amount" integer NOT NULL,
	"type" text NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "disallow_empty" CHECK ((description)
			    ::text <> ''::text)
);
--> statement-breakpoint
ALTER TABLE "favorite" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"text" text NOT NULL,
	"status" text DEFAULT 'New',
	"response" text,
	CONSTRAINT "feedback_status_check" CHECK (status
            = ANY (ARRAY['New'::text, 'In Progress'::text, 'Resolved'::text, 'Closed'::text]))
);
--> statement-breakpoint
ALTER TABLE "feedback" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY DEFAULT auth.uid() CONSTRAINT "user_id_key" UNIQUE,
	"firstName" text,
	"lastName" text,
	"email" text CONSTRAINT "user_email_key" UNIQUE,
	"active_account_id" uuid
);
--> statement-breakpoint
ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "setting" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"account_id" uuid DEFAULT public.active_account_id() NOT NULL,
	"date_format" text DEFAULT 'dd.MM.yyyy' NOT NULL,
	"import_default_category" uuid,
	"import_indicator" text DEFAULT 'none' NOT NULL,
	"due_transaction_reminder_days" integer DEFAULT 14 NOT NULL,
	"transaction_display_amount" text DEFAULT '#,##' NOT NULL,
	CONSTRAINT "setting_user_account_key" UNIQUE("user_id","account_id"),
	CONSTRAINT "setting_import_indicator_check" CHECK (import_indicator = ANY (ARRAY['none', 'both', 'manual', 'imported']))
);
--> statement-breakpoint
ALTER TABLE "setting" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "transactions_recurring" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"account_id" uuid DEFAULT public.active_account_id() NOT NULL,
	"description" varchar NOT NULL,
	"next_run" date,
	"amount" double precision NOT NULL,
	"type" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"interval" text NOT NULL,
	"category_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"status" text DEFAULT 'booked' NOT NULL,
	"webhook_id" uuid,
	"dueNotificationDays" integer,
	CONSTRAINT "disallow_empty" CHECK ((description)
			    ::text <> ''::text)
);
--> statement-breakpoint
ALTER TABLE "transactions_recurring" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "transaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"account_id" uuid DEFAULT public.active_account_id() NOT NULL,
	"description" varchar NOT NULL,
	"datetime" date NOT NULL,
	"amount" integer NOT NULL,
	"type" "transaction_type" NOT NULL,
	"category_id" uuid NOT NULL,
	"recurring_transaction_id" uuid,
	"cost_type" "cost_type" DEFAULT 'variable'::"cost_type" NOT NULL,
	"external_id" text,
	"imported_at" timestamp with time zone,
	"status" text DEFAULT 'booked' NOT NULL,
	"webhook_id" uuid,
	"dueNotificationDays" integer,
	CONSTRAINT "disallow_empty" CHECK ((description)
			    ::text <> ''::text)
);
--> statement-breakpoint
ALTER TABLE "transaction" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

--> statement-breakpoint
CREATE TABLE "webhook_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"account_id" uuid DEFAULT public.active_account_id() NOT NULL,
	"webhook_id" uuid NOT NULL,
	"status_code" integer,
	"error" text,
	"body" jsonb,
	"url" text NOT NULL,
	"executed_at" timestamp with time zone NOT NULL,
	"response_text" text,
	"http_method" text NOT NULL,
	"type" text NOT NULL,
	"test" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "webhook_event" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "webhook" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"account_id" uuid DEFAULT public.active_account_id() NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"description" text,
	"httpMethod" text NOT NULL,
	"eventType" text NOT NULL,
	"headers" jsonb DEFAULT '[]'
);
--> statement-breakpoint
ALTER TABLE "webhook" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "account_member_member_id_idx" ON "account_member" ("member_id");--> statement-breakpoint
CREATE INDEX "api_keys_user_id_idx" ON "api_key" ("user_id");--> statement-breakpoint
CREATE INDEX "budget_user_category_idx" ON "budget" ("user_id","category_id");--> statement-breakpoint
CREATE INDEX "budget_account_id_idx" ON "budget" ("account_id");--> statement-breakpoint
CREATE INDEX "categories_account_id_idx" ON "categories" ("account_id");--> statement-breakpoint
CREATE INDEX "favorite_account_id_idx" ON "favorite" ("account_id");--> statement-breakpoint
CREATE INDEX "setting_account_id_idx" ON "setting" ("account_id");--> statement-breakpoint
CREATE INDEX "transactions_recurring_account_id_idx" ON "transactions_recurring" ("account_id");--> statement-breakpoint
CREATE INDEX "transactions_account_id_idx" ON "transaction" ("account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "transactions_user_external_id_idx" ON "transaction" ("user_id","external_id") WHERE external_id IS NOT NULL;--> statement-breakpoint
CREATE INDEX "webhook_history_account_id_idx" ON "webhook_event" ("account_id");--> statement-breakpoint
CREATE INDEX "webhook_account_id_idx" ON "webhook" ("account_id");--> statement-breakpoint
ALTER TABLE "account_member" ADD CONSTRAINT "account_fk" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "account_member" ADD CONSTRAINT "profile_id" FOREIGN KEY ("member_id") REFERENCES "profile"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profile"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "budget" ADD CONSTRAINT "budget_category_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id");--> statement-breakpoint
ALTER TABLE "budget" ADD CONSTRAINT "budget_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profile"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "budget" ADD CONSTRAINT "budget_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_category_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id");--> statement-breakpoint
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "active_account_id_fkey" FOREIGN KEY ("active_account_id") REFERENCES "account"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "setting" ADD CONSTRAINT "setting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "setting" ADD CONSTRAINT "setting_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "setting" ADD CONSTRAINT "settings_importDefaultCategory_fkey" FOREIGN KEY ("import_default_category") REFERENCES "categories"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "transactions_recurring" ADD CONSTRAINT "transactions_recurring_category_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id");--> statement-breakpoint
ALTER TABLE "transactions_recurring" ADD CONSTRAINT "transactions_recurring_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transactions_category_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id");--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "categories_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id");--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transactions_recurring_transaction_fkey" FOREIGN KEY ("recurring_transaction_id") REFERENCES "transactions_recurring"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transactions_webhook_fkey" FOREIGN KEY ("webhook_id") REFERENCES "webhook"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "webhook_event" ADD CONSTRAINT "webhook_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "webhook_event" ADD CONSTRAINT "webhook_id_fkey" FOREIGN KEY ("webhook_id") REFERENCES "webhook"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "webhook" ADD CONSTRAINT "webhook_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE;--> statement-breakpoint
CREATE VIEW "transaction_auto_suggest" WITH (security_invoker = true) AS (WITH category_counts AS (
  SELECT t.account_id,
         TRIM(BOTH FROM t.description) AS description,
         t.type,
         c.id AS category,
         c.name,
         c.color,
         count(*) AS frequency,
         row_number() OVER (
           PARTITION BY t.account_id, TRIM(BOTH FROM t.description), t.type
           ORDER BY count(*) DESC, max(t.updated_at) DESC, c.id
         ) AS rn
  FROM transaction t
  JOIN categories c ON c.id = t.category_id AND c.account_id = t.account_id
  WHERE t.account_id = public.active_account_id()
  GROUP BY t.account_id, TRIM(BOTH FROM t.description), t.type, c.id, c.name, c.color
),
totals AS (
  SELECT account_id, description, type, sum(frequency) AS total_frequency
  FROM category_counts
  GROUP BY account_id, description, type
)
	SELECT row_number() OVER (ORDER BY t.total_frequency DESC, cc.description) AS unique_id,
		cc.account_id,
		   cc.description,
		   cc.type,
		   cc.category,
		   cc.name,
		   cc.color,
		   t.total_frequency AS frequency
	FROM category_counts cc
			 JOIN totals t ON cc.account_id = t.account_id
		AND cc.description = t.description
		AND cc.type = t.type
	WHERE cc.rn = 1
	ORDER BY t.total_frequency DESC, cc.description);--> statement-breakpoint
CREATE POLICY "account member can view their membership" ON "account_member" AS PERMISSIVE FOR SELECT TO public USING (member_id = (SELECT auth.uid()) OR is_account_member(account_id));--> statement-breakpoint
CREATE POLICY "account owner can add members" ON "account_member" AS PERMISSIVE FOR INSERT TO public WITH CHECK (is_account_owner(account_id));--> statement-breakpoint
CREATE POLICY "account owner can update members" ON "account_member" AS PERMISSIVE FOR UPDATE TO public USING (is_account_owner(account_id)) WITH CHECK (is_account_owner(account_id));--> statement-breakpoint
CREATE POLICY "account owner can delete members" ON "account_member" AS PERMISSIVE FOR DELETE TO public USING (is_account_owner(account_id));--> statement-breakpoint
CREATE POLICY "account members can view" ON "account" AS PERMISSIVE FOR SELECT TO public USING (is_account_member(id));--> statement-breakpoint
CREATE POLICY "authenticated users can create accounts" ON "account" AS PERMISSIVE FOR INSERT TO public WITH CHECK ((SELECT auth.uid()) IS NOT NULL);--> statement-breakpoint
CREATE POLICY "account owner can manage account" ON "account" AS PERMISSIVE FOR ALL TO public USING (is_account_owner(id)) WITH CHECK (is_account_owner(id));--> statement-breakpoint
CREATE POLICY "user's api keys only" ON "api_key" AS PERMISSIVE FOR ALL TO public USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "account members can select" ON "budget" AS PERMISSIVE FOR SELECT TO public USING (is_account_member(account_id));--> statement-breakpoint
CREATE POLICY "account write members can manage rows" ON "budget" AS PERMISSIVE FOR ALL TO public USING (is_account_writer(account_id)) WITH CHECK (is_account_writer(account_id));--> statement-breakpoint
CREATE POLICY "account members can select" ON "categories" AS PERMISSIVE FOR SELECT TO public USING (is_account_member(account_id));--> statement-breakpoint
CREATE POLICY "account write members can manage rows" ON "categories" AS PERMISSIVE FOR ALL TO public USING (is_account_writer(account_id)) WITH CHECK (is_account_writer(account_id));--> statement-breakpoint
CREATE POLICY "account members can select" ON "favorite" AS PERMISSIVE FOR SELECT TO public USING (is_account_member(account_id));--> statement-breakpoint
CREATE POLICY "account write members can manage rows" ON "favorite" AS PERMISSIVE FOR ALL TO public USING (is_account_writer(account_id)) WITH CHECK (is_account_writer(account_id));--> statement-breakpoint
CREATE POLICY "Allow users to delete their own entries" ON "feedback" AS PERMISSIVE FOR DELETE TO public USING ((user_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "Allow users to insert a new entry" ON "feedback" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Allow users to read their own entries" ON "feedback" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Allow users to update their own entries" ON "feedback" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "user's profile" ON "profile" AS PERMISSIVE FOR ALL TO public USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));--> statement-breakpoint
CREATE POLICY "account co-members can view each other's profile" ON "profile" AS PERMISSIVE FOR SELECT TO public USING (EXISTS (
				SELECT 1 FROM account_member
				WHERE account_member.member_id = profile.id
				AND is_account_member(account_member.account_id)
			));--> statement-breakpoint
CREATE POLICY "account members can select" ON "setting" AS PERMISSIVE FOR SELECT TO public USING (is_account_member(account_id));--> statement-breakpoint
CREATE POLICY "account write members can manage rows" ON "setting" AS PERMISSIVE FOR ALL TO public USING (is_account_writer(account_id)) WITH CHECK (is_account_writer(account_id));--> statement-breakpoint
CREATE POLICY "account members can select" ON "transactions_recurring" AS PERMISSIVE FOR SELECT TO public USING (is_account_member(account_id));--> statement-breakpoint
CREATE POLICY "account write members can manage rows" ON "transactions_recurring" AS PERMISSIVE FOR ALL TO public USING (is_account_writer(account_id)) WITH CHECK (is_account_writer(account_id));--> statement-breakpoint
CREATE POLICY "account members can select" ON "transaction" AS PERMISSIVE FOR SELECT TO public USING (is_account_member(account_id));--> statement-breakpoint
CREATE POLICY "account write members can manage rows" ON "transaction" AS PERMISSIVE FOR ALL TO public USING (is_account_writer(account_id)) WITH CHECK (is_account_writer(account_id));--> statement-breakpoint
CREATE POLICY "account members can select" ON "webhook_event" AS PERMISSIVE FOR SELECT TO public USING (is_account_member(account_id));--> statement-breakpoint
CREATE POLICY "account write members can manage rows" ON "webhook_event" AS PERMISSIVE FOR ALL TO public USING (is_account_writer(account_id)) WITH CHECK (is_account_writer(account_id));--> statement-breakpoint
CREATE POLICY "account members can select" ON "webhook" AS PERMISSIVE FOR SELECT TO public USING (is_account_member(account_id));--> statement-breakpoint
CREATE POLICY "account write members can manage rows" ON "webhook" AS PERMISSIVE FOR ALL TO public USING (is_account_writer(account_id)) WITH CHECK (is_account_writer(account_id));


--> statement-breakpoint
CREATE OR REPLACE TRIGGER after_insert_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_profile();
