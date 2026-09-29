import Link from "next/link";
import { getCurrentUser } from "@/features/auth/auth-actions";
import LogoutButton from "@/features/auth/logout-button";
import { Button } from "@/features/ui/button";

export default async function AppButton() {
	const user = await getCurrentUser();

	if (!user) {
		return (
			<Link href="/login">
				<Button size="sm" className="w-full">
					Sign Up
				</Button>
			</Link>
		);
	}

	return (
		<div className="flex gap-x-2">
			<Link href="/dashboard">
				<Button className="w-full" size="sm">
					Dashboard
				</Button>
			</Link>

			<LogoutButton />
		</div>
	);
}
