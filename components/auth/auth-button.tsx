import Link from "next/link";

import { signOut } from "@/components/auth/auth-actions";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <form action={signOut}>
        <Button variant="ghost">Logout</Button>
      </form>
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <Link href="/login">Login</Link>
    </div>
  );
}
