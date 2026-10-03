ALTER TABLE "transactions" RENAME TO "transaction";--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "imported_at" date;