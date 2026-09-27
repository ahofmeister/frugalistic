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

	const myAccounts = memberships.filter(({ account }) => account.userId === profile.id);
	const sharedAccounts = memberships.filter(({ account }) => account.userId !== profile.id);

	const renderRows = (rows: typeof memberships) =>
		rows.map(({ account, role }) => (
			<TableRow key={account.id}>
				<TableCell>{account.name}</TableCell>
				<TableCell>{role}</TableCell>
				<TableCell>{formatDate(account.createdAt, setting.dateFormat)}</TableCell>
				<TableCell>
					{profile.activeAccountId !== account.id && (
						<SwitchActiveAccountButton accountId={account.id} />
					)}
					{profile.activeAccountId === account.id && <Badge variant="secondary">Current</Badge>}
				</TableCell>
			</TableRow>
		));

	return (
		<div className="flex flex-col gap-y-8">
			<div>
				<h2>My Accounts</h2>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Account</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Created</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>{renderRows(myAccounts)}</TableBody>
				</Table>
			</div>

			{sharedAccounts.length > 0 && (
				<div>
					<h2>Shared With Me</h2>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Account</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Created</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>{renderRows(sharedAccounts)}</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
};

export default AccountList;
