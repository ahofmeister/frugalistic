import { UserCog } from "lucide-react";

import DeleteAccount from "@/app/dashboard/account/components/delete-account";
import ProfileForm from "@/app/dashboard/account/components/profile-form";
import UpdatePassword from "@/app/dashboard/account/components/update-password-form";
import { createClient } from "@/utils/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: user } = await supabase.from("profile").select("*").single();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl space-y-8">
        <div className="flex items-center gap-2">
          <UserCog className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Account Settings</h1>
        </div>

        <ProfileForm user={user} />
        <UpdatePassword />

        <DeleteAccount />
      </div>
    </div>
  );
}
