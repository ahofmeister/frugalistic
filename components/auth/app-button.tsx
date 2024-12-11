"use client";

import { User } from "@supabase/auth-js";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function AppButton() {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || undefined);
      setLoading(false);
    };

    void fetchUser();
  }, [supabase]);

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Button variant="default" size="sm">
        <Link href="/login">Sign Up</Link>
      </Button>
    );
  }

  return (
    <Button variant="default" size="sm">
      <Link href="/dashboard">Dashboard</Link>
    </Button>
  );
}
