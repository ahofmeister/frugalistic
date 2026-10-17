ALTER TABLE "transactions_recurring" ADD COLUMN "start_date" date;

UPDATE transactions_recurring r
SET start_date = coalesce(
        (SELECT min(t.datetime) FROM "transaction" t WHERE t.recurring_transaction_id = r.id),
        r.next_run
                 );

ALTER TABLE transactions_recurring ALTER COLUMN start_date SET NOT NULL;