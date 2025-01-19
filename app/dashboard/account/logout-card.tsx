"use client";
import { signOut } from "@/components/auth/auth-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function LogoutCard() {
  return (
    <Card>
      <Button size="sm" className="w-full" onClick={() => signOut()}>
        Log out
      </Button>
    </Card>
  );
}
