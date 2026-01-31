import { differenceInDays } from "date-fns";
import FormattedDate from "@/app/(dashboard)/dashboard/formatted-date";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";

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
			<CardFooter className="flex flex-col items-start gap-1">
				{user?.created_at && (
					<>
						<FormattedDate date={user.created_at} format={settings.date_format} />
						<div className="text-sm text-muted-foreground">
							{differenceInDays(new Date(), new Date(user.created_at))} days
						</div>
					</>
				)}
			</CardFooter>
		</Card>
	);
};
