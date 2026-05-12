"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "An unknown error occurred";
  const errorDescription = searchParams.get("error_description") || "";

  useEffect(() => {
    // Log the error for debugging
    console.error("Auth error:", error, errorDescription);
  }, [error, errorDescription]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto bg-destructive/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
            <p className="font-medium">{error}</p>
            {errorDescription && (
              <p className="mt-1 text-muted-foreground">{errorDescription}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => router.push("/login")}
              className="w-full"
            >
              Back to Login
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/signup")}
              className="w-full"
            >
              Create Account
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Need help? Contact support at{" "}
            <Link href="mailto:support@sponsornepal.com" className="text-primary hover:underline">
              support@sponsornepal.com
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}