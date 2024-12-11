import { AlertCircle } from "lucide-react";

import AppButton from "@/components/auth/app-button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-muted-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-center">
            Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            Oops! The page you are looking for does not exist. It might have
            been moved or deleted.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <AppButton />
        </CardFooter>
      </Card>
    </div>
  );
}
