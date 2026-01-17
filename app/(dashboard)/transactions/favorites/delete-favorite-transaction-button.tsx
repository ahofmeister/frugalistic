"use client";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { removeFavorite } from "@/components/favorite/favorite-actions";
import { Button } from "@/components/ui/button";

export function DeleteFavoriteTransactionButton({
	favoriteId,
}: {
	favoriteId: string;
}) {
	return (
		<Button
			variant="ghost"
			size="sm"
			className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
			onClick={async () => {
				await removeFavorite(favoriteId);
				toast.success("Favorite transaction removed.");
				toast.error("Failed to remove favorite transaction.");
			}}
		>
			<Trash2 className="h-4 w-4" />
		</Button>
	);
}
