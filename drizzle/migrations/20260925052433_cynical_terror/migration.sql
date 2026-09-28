create or replace function public.active_account_id()
returns uuid
language sql
stable
as $$
select active_account_id from profile where id = auth.uid()
    $$;


ALTER TABLE "transactions" ALTER COLUMN "account_id" SET DEFAULT public.active_account_id();--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "account_id" SET NOT NULL;