"use client";

import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/use-auth-store";
import { useEffect, type ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoading, supabase]);

  return <>{children}</>;
}