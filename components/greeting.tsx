import React from "react";

import { createClient } from "@/utils/supabase/server";

const Greeting = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <>Welcome {user?.email}</>;
};

export default Greeting;
