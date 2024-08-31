"use server";
import { createClient } from "@/utils/supabase/server";

export const signOut = async () => {
  "use server";
  const supabase = createClient();
  await supabase.auth.signOut();
};
