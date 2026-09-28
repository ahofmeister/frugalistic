"use client";
import { LogOutIcon } from "lucide-react";
import { signOut } from "@/components/auth/auth-actions";
import { Button } from "@/components/ui/button";

const LogoutButton = () => {
	return (
		<Button variant="secondary" size="sm" onClick={signOut}>
			<LogOutIcon />
			Logout
		</Button>
	);
};

export default LogoutButton;
