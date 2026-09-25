BEGIN;

-- 1. Create one personal account per existing user + owner membership
WITH ids AS (
	SELECT id AS user_id, gen_random_uuid() AS account_id
	FROM profile
),
inserted_accounts AS (
	INSERT INTO account (id, name, created_at, updated_at)
	SELECT account_id, 'Personal', now(), now()
	FROM ids
),
inserted_members AS (
	INSERT INTO account_member (account_id, member_id, role)
	SELECT account_id, user_id, 'owner'
	FROM ids
)
UPDATE transactions t
SET account_id = ids.account_id
FROM ids
WHERE ids.user_id = t.user_id;

-- 2. Backfill categories and budget
WITH ids AS (
	SELECT member_id AS user_id, account_id
	FROM account_member
	WHERE role = 'owner'
)
UPDATE categories c
SET account_id = ids.account_id
FROM ids
WHERE ids.user_id = c.user_id;

WITH ids AS (
	SELECT member_id AS user_id, account_id
	FROM account_member
	WHERE role = 'owner'
)
UPDATE budget b
SET account_id = ids.account_id
FROM ids
WHERE ids.user_id = b.user_id;

-- 3. Backfill transactions_recurring and favorite
WITH ids AS (
	SELECT member_id AS user_id, account_id
	FROM account_member
	WHERE role = 'owner'
)
UPDATE transactions_recurring t
SET account_id = ids.account_id
FROM ids
WHERE ids.user_id = t.user_id;

WITH ids AS (
	SELECT member_id AS user_id, account_id
	FROM account_member
	WHERE role = 'owner'
)
UPDATE favorite f
SET account_id = ids.account_id
FROM ids
WHERE ids.user_id = f.user_id;