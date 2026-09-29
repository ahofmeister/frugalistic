import { formatDate } from "date-fns";
import { getSettings } from "@/app/(dashboard)/settings/settings-actions";
import { RemoveAccountSharingButton } from "@/features/account/remove-account-sharing-button";
import SwitchActiveAccountButton from "@/features/account/switch-active-account-button";
import { getProfile } from "@/features/profile/profile-actions";
import { Badge } from "@/features/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/features/ui/table";
import { dbTransaction } from "@/drizzle/client";

const AccountList = async () => {
	const profile = await getProfile();

	if (!profile) {
		return null;
	}

	const ownerAccount = await dbTransaction((tx) => {
		return tx.query.accountSchema.findFirst({
			where: {
				userId: profile.id,
			},
		});
	});

	const memberships = await dbTransaction((tx) => {
		return tx.query.accountMemberSchema.findMany({
			with: {
				account: {
					with: {
						owner: true,
					},
				},
				member: true,
			},
			where: ownerAccount
				? { OR: [{ memberId: profile.id }, { accountId: ownerAccount.id }] }
				: { memberId: profile.id },
		});
	});

	const setting = await getSettings();

	const sortedMemberships = [...memberships].sort((a, b) => {
		const aMine = a.memberId === profile.id;
		const bMine = b.memberId === profile.id;
		return aMine === bMine ? 0 : aMine ? -1 : 1;
	});

	return (
		<div>
			<h2>Accounts</h2>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Account</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sortedMemberships.map(({ account, member, memberId, role }) => {
						const isYours = memberId === profile.id;
						const isOwnerOfThisAccount = account.userId === profile.id;

						if (!account.owner) {
							return <div></div>;
						}

						return (
							<TableRow key={`${account.id}-${memberId}`}>
								<TableCell>{account.name}</TableCell>
								<TableCell>{role}</TableCell>
								<TableCell>
									{isYours && isOwnerOfThisAccount ? (
										<Badge>Own</Badge>
									) : isYours ? (
										<Badge variant="outline">Shared from {formatName(account.owner)}</Badge>
									) : (
										<Badge variant="outline">Shared with {formatName(member)}</Badge>
									)}
								</TableCell>
								<TableCell>{formatDate(account.createdAt, setting.dateFormat)}</TableCell>
								<TableCell className="flex gap-x-1">
									{isYours && profile.activeAccountId !== account.id && (
										<SwitchActiveAccountButton accountId={account.id} />
									)}
									{isYours && profile.activeAccountId === account.id && (
										<Badge variant="secondary">Current</Badge>
									)}
									{(!isYours || !isOwnerOfThisAccount) && (
										<RemoveAccountSharingButton accountId={account.id} memberId={memberId} />
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

const formatName = (person?: {
	firstName: string | null;
	lastName: string | null;
	email: string | null;
}) => {
	if (!person) {
		return "Unknown";
	}

	const fullName = [person.firstName, person.lastName].filter(Boolean).join(" ");

	return fullName || person.email || "Unknown";
};
