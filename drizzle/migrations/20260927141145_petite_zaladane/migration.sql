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
           $$;

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
        $$;

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
        $$;