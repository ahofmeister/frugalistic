-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."feedback_status" AS ENUM('new', 'resolved', 'closed');--> statement-breakpoint
CREATE TYPE "public"."onboarding_status" AS ENUM('current', 'complete', 'skip', 'open');--> statement-breakpoint
CREATE TYPE "public"."onboarding_step" AS ENUM('categories', 'welcome');--> statement-breakpoint
CREATE TYPE "public"."recurring_interval" AS ENUM('monthly', 'annually');--> statement-breakpoint
CREATE TYPE "public"."setting_key" AS ENUM('date_format');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('income', 'expense', 'savings');--> statement-breakpoint
CREATE TABLE "favorite" (
	"created_at" timestamp with time zone DEFAULT now(),
	"description" varchar NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"amount" integer NOT NULL,
	"type" "transaction_type" NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" uuid,
	CONSTRAINT "disallow_empty" CHECK ((description)::text <> ''::text)
);
--> statement-breakpoint
ALTER TABLE "favorite" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "categories" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" text,
	"icon" text
);
--> statement-breakpoint
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "transactions" (
	"created_at" timestamp with time zone DEFAULT now(),
	"description" varchar NOT NULL,
	"datetime" date DEFAULT now() NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"amount" integer NOT NULL,
	"type" "transaction_type" NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" uuid,
	"recurring_transaction" uuid,
	CONSTRAINT "disallow_empty" CHECK ((description)::text <> ''::text)
);
--> statement-breakpoint
ALTER TABLE "transactions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "transactions_recurring" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"description" varchar NOT NULL,
	"next_run" date,
	"user_id" uuid NOT NULL,
	"amount" double precision NOT NULL,
	"type" "transaction_type" NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"interval" "recurring_interval" NOT NULL,
	"category" uuid,
	CONSTRAINT "disallow_empty" CHECK ((description)::text <> ''::text)
);
--> statement-breakpoint
ALTER TABLE "transactions_recurring" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "setting" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date_format" text DEFAULT 'dd.MM.yyyy' NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	CONSTRAINT "setting_user_id_key" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "setting" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid DEFAULT auth.uid(),
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"status" text DEFAULT 'New',
	"response" text,
	CONSTRAINT "feedback_status_check" CHECK (status = ANY (ARRAY['New'::text, 'In Progress'::text, 'Resolved'::text, 'Closed'::text]))
);
--> statement-breakpoint
ALTER TABLE "feedback" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY DEFAULT auth.uid() NOT NULL,
	"firstName" text,
	"lastName" text,
	"email" text,
	CONSTRAINT "user_id_key" UNIQUE("id"),
	CONSTRAINT "user_email_key" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recurring_transaction_fkey" FOREIGN KEY ("recurring_transaction") REFERENCES "public"."transactions_recurring"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions_recurring" ADD CONSTRAINT "transactions_recurring_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions_recurring" ADD CONSTRAINT "transactions_recurring_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "setting" ADD CONSTRAINT "setting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE VIEW "public"."transaction_auto_suggest" WITH (security_invoker = true) AS (WITH category_counts AS ( SELECT TRIM(BOTH FROM t_1.description) AS description, t_1.type, c.id AS category, c.name, c.color, count(*) AS frequency, row_number() OVER (PARTITION BY (TRIM(BOTH FROM t_1.description)), t_1.type ORDER BY (count(*)) DESC) AS rn FROM transactions t_1 JOIN categories c ON c.id = t_1.category GROUP BY (TRIM(BOTH FROM t_1.description)), t_1.type, c.id, c.name, c.color ), totals AS ( SELECT category_counts.description, category_counts.type, sum(category_counts.frequency) AS total_frequency FROM category_counts GROUP BY category_counts.description, category_counts.type ) SELECT row_number() OVER (ORDER BY t.total_frequency DESC, cc.description) AS unique_id, cc.description, cc.type, cc.category, cc.name, cc.color, t.total_frequency AS frequency FROM category_counts cc JOIN totals t ON cc.description = t.description AND cc.type = t.type WHERE cc.rn = 1 ORDER BY t.total_frequency DESC, cc.description);--> statement-breakpoint
CREATE POLICY "User can see favorites" ON "favorite" AS PERMISSIVE FOR ALL TO public USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "user's categories" ON "categories" AS PERMISSIVE FOR ALL TO public USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "user's transaction only" ON "transactions" AS PERMISSIVE FOR ALL TO public USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Allow users to delete their own entries" ON "transactions_recurring" AS PERMISSIVE FOR DELETE TO public USING ((user_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "Allow users to insert a new entry" ON "transactions_recurring" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Allow users to read their own entries" ON "transactions_recurring" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Allow users to update their own entries" ON "transactions_recurring" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Allow users to delete their own entries" ON "setting" AS PERMISSIVE FOR DELETE TO public USING ((user_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "Allow users to insert a new entry" ON "setting" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Allow users to read their own entries" ON "setting" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Allow users to update their own entries" ON "setting" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Allow users to delete their own entries" ON "feedback" AS PERMISSIVE FOR DELETE TO public USING ((user_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "Allow users to insert a new entry" ON "feedback" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Allow users to read their own entries" ON "feedback" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Allow users to update their own entries" ON "feedback" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "user's profile" ON "profile" AS PERMISSIVE FOR ALL TO public USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));
*/