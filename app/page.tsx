import { redirect } from "next/navigation";

import Dashboard from "@/components/dashboard/dashboard";
import { createClient } from "@/utils/supabase/server";

export default async function Index({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <Dashboard
      month={
        searchParams.year ? Number(searchParams.month) : new Date().getMonth()
      }
      year={searchParams.year ? Number(searchParams.year) : 2024}
    />
  );
}
