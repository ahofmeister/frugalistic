import { formatDate } from "date-fns";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import SwitchActiveAccountButton from "@/components/account/switch-active-account-button";
import { getProfile } from "@/components/profile/profile-actions";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { dbTransaction } from "@/drizzle/client";

const AccountList = async () => {
	const profile = await getProfile();

	if (!profile) {
		return null;
	}

	const memberships = await dbTransaction((tx) => {
		return tx.query.accountMemberSchema.findMany({
			where: {
				memberId: profile.id,
			},
			with: {
				account: true,
			},
		});
	});

	const setting = await getSettings();

	const sortedMemberships = [...memberships].sort((a, b) => {
		const aOwned = a.account.userId === profile.id;
		const bOwned = b.account.userId === profile.id;
		return aOwned === bOwned ? 0 : aOwned ? -1 : 1;
	});

	return (
		<div>
			<h2>Accounts</h2>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Account</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Owner</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sortedMemberships.map(({ account, role }) => {
						const isOwner = account.userId === profile.id;
						return (
							<TableRow key={account.id}>
								<TableCell>{account.name}</TableCell>
								<TableCell>{role}</TableCell>
								<TableCell>
									{isOwner ? <Badge>You</Badge> : <Badge variant="outline">Shared</Badge>}
								</TableCell>
								<TableCell>{formatDate(account.createdAt, setting.dateFormat)}</TableCell>
								<TableCell>
									{profile.activeAccountId !== account.id && (
										<SwitchActiveAccountButton accountId={account.id} />
									)}
									{profile.activeAccountId === account.id && (
										<Badge variant="secondary">Current</Badge>
									)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
};

export default AccountList;
