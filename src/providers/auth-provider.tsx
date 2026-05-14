"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProviderInner>{children}</AuthProviderInner>
      </NextThemesProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, setInitialized } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
              full_name: userData.full_name,
              avatar_url: userData.avatar_url,
              is_verified: userData.is_verified,
              is_suspended: userData.is_suspended,
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      } finally {
        setInitialized(true);
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            role: userData.role,
            full_name: userData.full_name,
            avatar_url: userData.avatar_url,
            is_verified: userData.is_verified,
            is_suspended: userData.is_suspended,
          });
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, setUser, setLoading, setInitialized]);

  return <>{children}</>;
}

export function AuthLoader({ children }: { children: React.ReactNode }) {
  const { isInitialized, isLoading } = useAuthStore();

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}