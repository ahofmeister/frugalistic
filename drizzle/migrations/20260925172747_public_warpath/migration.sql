ALTER TABLE "account" ADD CONSTRAINT "account_user_id_profile_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profile"("id");--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_user_id_profile_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profile"("id");--> statement-breakpoint
ALTER TABLE "budget" ADD CONSTRAINT "budget_user_id_profile_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profile"("id");--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_profile_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profile"("id");--> statement-breakpoint
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_id_profile_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profile"("id");--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_profile_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profile"("id");--> statement-breakpoint
ALTER TABLE "transactions_recurring" ADD CONSTRAINT "transactions_recurring_user_id_profile_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profile"("id");--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_profile_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profile"("id");