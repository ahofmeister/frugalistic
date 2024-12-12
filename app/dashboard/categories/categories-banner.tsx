import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createClient } from "@/utils/supabase/server";

export async function CategoriesBanner() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  if (count && count > 0) {
    return <></>;
  }

  return (
    <Alert className="w-fit">
      <TriangleAlert className="size-5" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You do not have any category yet. Click
        <Link className="underline" href="/dashboard/categories">
          {" "}
          here{" "}
        </Link>
        to create them.
      </AlertDescription>
    </Alert>
  );
}
