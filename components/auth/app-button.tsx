import Link from "next/link";

import { createClient } from "@/utils/supabase/server";

export default async function AppButton({
  publicArea,
}: {
  publicArea: boolean;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/">Frugalistic</Link>
      </div>
    );
  }

  if (!publicArea) {
    return <></>;
  }
  return (
    <div className="flex items-center gap-4">
      <Link href="/dashboard">Dashboard</Link>
    </div>
  );
}
