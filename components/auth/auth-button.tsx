import Link from "next/link";

import { getCurrentUser, signOut } from "@/components/auth/auth-actions";
import { Button } from "@/components/ui/button";

export default async function AuthButton() {
	const user = await getCurrentUser();

	return user ? (
		<div className="flex items-center gap-4">
			<form action={signOut}>
				<Button variant="ghost">Logout</Button>
			</form>
		</div>
	) : (
		<div className="flex items-center gap-4">
			<Link href="/login">Login</Link>
		</div>
	);
}
