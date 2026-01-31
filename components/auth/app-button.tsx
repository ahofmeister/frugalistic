import Link from "next/link";
import { getCurrentUser } from "@/components/auth/auth-actions";
import { Button } from "@/components/ui/button";

export default async function AppButton() {
	const user = await getCurrentUser();

	if (!user) {
		return (
			<Link href="/login">
				<Button variant="default" size="sm" className="w-full">
					Sign Up
				</Button>
			</Link>
		);
	}

	return (
		<Link href="/dashboard">
			<Button variant="default" className="w-full" size="sm">
				Dashboard
			</Button>
		</Link>
	);
}
