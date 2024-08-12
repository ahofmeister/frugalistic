import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AppButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <Link href="/dashboard">
        <Button size="sm">Dashboard</Button>
      </Link>
    </div>
  ) : (
    <Link href="/login" className="py-2 px-3">
      <Button size="sm">Login</Button>
    </Link>
  );
}
