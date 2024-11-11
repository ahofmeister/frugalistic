import AccountForm from "@/app/dashboard/account/components/account-form";
import { createClient } from "@/utils/supabase/server";

export default async function AccountPage() {
  const supabase = createClient();
  const { data: user } = await supabase.from("profile").select("*").single();

  return (
    <div>
      <AccountForm user={user} />
    </div>
  );
}
