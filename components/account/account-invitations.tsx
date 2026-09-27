import { formatDate } from "date-fns";
import { notFound } from "next/navigation";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { AcceptAccountInvitationButton } from "@/components/account/accept-account-invitation-button";
import { DeleteInvitationButton } from "@/components/account/delete-invitation-button";
import { getCurrentUser } from "@/components/auth/auth-actions";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { db } from "@/drizzle/client";

const AccountList = async () => {
	const invitations = await db.query.accountInvitationSchema.findMany({
		with: {
			toMember: true,
		},
	});

	if (!invitations) {
		return;
	}

	const settings = await getSettings();

	const user = await getCurrentUser();

	if (!user) {
		notFound();
	}

	if (invitations.length === 0) {
		return;
	}

	return (
		<>
			<h2>Invitations</h2>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Email</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{invitations.map(({ id, accountRole, toMember, createdAt, accountId }) => {
						return (
							<TableRow key={id}>
								<TableCell>{toMember?.email}</TableCell>
								<TableCell>{accountRole}</TableCell>
								<TableCell>{formatDate(createdAt, settings.dateFormat)}</TableCell>
								<TableCell className="flex gap-x-1">
									<DeleteInvitationButton
										id={id}
										label={user.id === toMember.id ? "Decline" : "Delete"}
									/>
									{user.id === toMember.id && (
										<AcceptAccountInvitationButton
											accountId={accountId}
											memberId={toMember.id}
											role={accountRole}
											invitationId={id}
										/>
									)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</>
	);
};

export default AccountList;
