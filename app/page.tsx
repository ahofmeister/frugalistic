import { redirect } from "next/navigation";

import Dashboard from "@/components/dashboard/dashboard";
import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return <Dashboard />;
}
