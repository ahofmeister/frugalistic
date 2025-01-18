import Link from "next/link";

import CategoriesCard from "@/app/dashboard/account/categories-card";
import DeleteAccount from "@/app/dashboard/account/components/delete-account";
import ProfileForm from "@/app/dashboard/account/components/profile-form";
import UpdatePassword from "@/app/dashboard/account/components/update-password-form";
import RecurringTransactionsCard from "@/app/dashboard/account/recurring-transactions-card";
import SettingsCard from "@/app/dashboard/account/settings-card";
import FeedbackCard from "@/app/dashboard/feedback-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: user } = await supabase.from("profile").select("*").single();

  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex flex-col max-w-2xl gap-y-4">
        <div className="text-2xl font-bold">Account</div>

        <CategoriesCard />

        <RecurringTransactionsCard />

        <SettingsCard />

        <ProfileForm user={user} />
        <UpdatePassword />

        <FeedbackCard />
        <Link href="/dashboard/statistics">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
          </Card>
        </Link>

        <DeleteAccount />
      </div>
    </div>
  );
}
