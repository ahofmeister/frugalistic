import { differenceInDays } from "date-fns";
import FormattedDate from "@/app/(dashboard)/dashboard/formatted-date";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { getCurrentUser } from "@/components/auth/auth-actions";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const MemberSince = async () => {
	const user = await getCurrentUser();

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
