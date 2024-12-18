import { formatDate } from "date-fns";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";

export const MemberSince = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="text-xl">Frugalist since</div>
        </CardTitle>
      </CardHeader>
      <CardFooter>
        {user && user.created_at && formatDate(user?.created_at, "dd.MM.yyyy")}
      </CardFooter>
    </Card>
  );
};
