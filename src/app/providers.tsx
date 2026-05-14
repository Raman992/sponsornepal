"use client";

import { type ReactNode } from "react";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Providers as AuthProviders } from "@/providers/auth-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <AuthProviders>
          {children}
        </AuthProviders>
      </QueryProvider>
    </ThemeProvider>
  );
}