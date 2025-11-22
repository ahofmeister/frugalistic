import Link from "next/link";
import React from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CategoriesCard = () => {
  return (
    <Link href="/settings">
      <Card className="flex justify-between">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Date Format</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default CategoriesCard;
