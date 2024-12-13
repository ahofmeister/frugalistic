import { HeartCrack } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface TableEmptyStateProps {
  colSpan: number;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  link?: string;
}

export function TableEmptyState({
  colSpan,
  title = "No results found",
  description = "There are no items to display at the moment.",
  actionLabel,
  onAction,
  link,
}: TableEmptyStateProps) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="h-[300px] text-center">
        <div className="flex flex-col items-center justify-center h-full">
          <HeartCrack className="w-20 h-20 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">{title}</p>
          <p className="text-muted-foreground mb-4">{description}</p>
          {actionLabel && onAction && (
            <Button onClick={onAction}>{actionLabel}</Button>
          )}
          {link && (
            <Link href={link}>
              <Button>{actionLabel}</Button>
            </Link>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
