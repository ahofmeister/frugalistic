import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AppButton({ loggedIn }: { loggedIn: boolean }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <></>;
  }

  if (!loggedIn) {
    return (
      <div className="flex items-center gap-4">
        <Link href="dashboard">
          <Button>Dashboard</Button>
        </Link>
      </div>
    );
  }
}
