import FormattedDate from "@/app/dashboard/formatted-date";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { getSettings } from "@/app/dashboard/settings/settings-actions";

export const MemberSince = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const settings = await getSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="text-xl">Frugalist since</div>
        </CardTitle>
      </CardHeader>
      <CardFooter>
        {user && user.created_at && (
          <FormattedDate date={user.created_at} format={settings.date_format} />
        )}
      </CardFooter>
    </Card>
  );
};
