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

  return <div>{process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}</div>;
}
