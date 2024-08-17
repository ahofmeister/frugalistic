import Link from "next/link";

import { createClient } from "@/utils/supabase/server";

export default async function AppButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <Link href="/dashboard">Dashboard</Link>
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <Link href="/login">Login</Link>
    </div>
  );
}
