import { redirect } from "next/navigation";
import React from "react";

import { createClient } from "@/utils/supabase/server";

export default async function TransactionsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data } = await supabase.from("transactions_recurring").select();

  return (
    <>
      <div className="flex gap-10">
        {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </>
  );
}
