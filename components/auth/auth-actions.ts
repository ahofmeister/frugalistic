"use server";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export const signOut = async () => {
  "use server";
  const supabase = createClient();
  await supabase.auth.signOut();
};
