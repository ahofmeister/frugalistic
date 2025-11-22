import DeleteAccount from "@/app/(dashboard)/account/components/delete-account";
import UpdatePassword from "@/app/(dashboard)/account/components/update-password-form";
import { LogoutCard } from "@/app/(dashboard)/account/logout-card";
import SettingsCard from "@/app/(dashboard)/account/settings-card";
import { AccountProfileSection } from "@/app/(dashboard)/account/accountProfileSection";
import { Suspense } from "react";

export default async function AccountPage() {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex flex-col max-w-2xl gap-y-4">
        <div className="text-2xl font-bold">Account</div>

        <SettingsCard />

        <Suspense>
          <AccountProfileSection />
        </Suspense>
        <UpdatePassword />

        <LogoutCard />

        <DeleteAccount />
      </div>
    </div>
  );
}
