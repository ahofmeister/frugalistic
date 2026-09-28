import Link from "next/link";
import { getCurrentUser } from "@/components/auth/auth-actions";
import LogoutButton from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";

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
