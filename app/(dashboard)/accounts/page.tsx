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

const AccountsPage = async () => {
	const memberships = await dbTransaction((tx) => {
		return tx.query.accountMemberSchema.findMany({
			with: {
				account: true,
			},
		});
	});

	const setting = await getSettings();
	const profile = await getProfile();

	return (
		<Table className="max-w-xl mx-auto">
			<TableHeader>
				<TableRow>
					<TableHead>Account</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Created</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{memberships.map(({ account, role }) => {
					return (
						<TableRow key={account.id}>
							<TableCell>{account.name}</TableCell>
							<TableCell>{role}</TableCell>
							<TableCell>{formatDate(account.createdAt, setting.dateFormat)}</TableCell>
							{profile?.activeAccountId !== account.id && (
								<SwitchActiveAccountButton accountId={account.id} />
							)}
							{profile?.activeAccountId === account.id && (
								<Badge variant="secondary">Current</Badge>
							)}
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
};

export default AccountsPage;
