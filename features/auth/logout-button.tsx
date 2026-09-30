"use client";
import { LogOutIcon } from "lucide-react";
import { signOut } from "@/features/auth/auth-actions";
import { Button } from "@/features/ui/button";

const LogoutButton = () => {
	return (
		<Button variant="secondary" size="sm" onClick={signOut}>
			<LogOutIcon />
			Logout
		</Button>
	);
};

export default LogoutButton;
