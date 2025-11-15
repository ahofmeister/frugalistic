import Link from "next/link";

import CategoriesCard from "@/app/dashboard/account/categories-card";
import DeleteAccount from "@/app/dashboard/account/components/delete-account";
import UpdatePassword from "@/app/dashboard/account/components/update-password-form";
import { LogoutCard } from "@/app/dashboard/account/logout-card";
import RecurringTransactionsCard from "@/app/dashboard/account/recurring-transactions-card";
import SettingsCard from "@/app/dashboard/account/settings-card";
import FeedbackCard from "@/app/dashboard/feedback-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountProfileSection } from "@/app/dashboard/account/accountProfileSection";
import { Suspense } from "react";

export default async function AccountPage() {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex flex-col max-w-2xl gap-y-4">
        <div className="text-2xl font-bold">Account</div>

        <Suspense>
          <CategoriesCard />
        </Suspense>

        <Suspense>
          <RecurringTransactionsCard />
        </Suspense>

        <SettingsCard />

        <Suspense>
          <AccountProfileSection />
        </Suspense>
        <UpdatePassword />

        <FeedbackCard />
        <Link href="/dashboard/statistics">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
          </Card>
        </Link>

        <LogoutCard />

        <DeleteAccount />
      </div>
    </div>
  );
}
