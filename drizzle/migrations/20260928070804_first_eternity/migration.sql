CREATE OR REPLACE FUNCTION public.create_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;