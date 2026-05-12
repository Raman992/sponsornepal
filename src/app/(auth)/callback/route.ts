import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const role = searchParams.get("role") || "creator";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, errorDescription);
    const url = new URL("/login", request.url);
    url.searchParams.set("error", error);
    if (errorDescription) {
      url.searchParams.set("error_description", errorDescription);
    }
    return NextResponse.redirect(url);
  }

  if (code) {
    const supabase = await createClient();

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      // Get the user's role from the database
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Check if user exists in our users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        // If user doesn't exist in our table, create their profile based on the role parameter
        if (userError || !userData) {
          const { error: insertError } = await supabase.from("users").insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata.full_name || "",
            role: role,
          });

          if (!insertError) {
            // Create role-specific profile
            if (role === "creator") {
              await supabase.from("creator_profiles").insert({
                user_id: user.id,
                username: (user.user_metadata.full_name || "").toLowerCase().replace(/\s+/g, "_"),
              });
            } else if (role === "brand") {
              await supabase.from("brand_profiles").insert({
                user_id: user.id,
                company_name: user.user_metadata.full_name || "",
              });
            }
          }
        }

        const userRole = userData?.role || role;
        return NextResponse.redirect(new URL(`/dashboard/${userRole}?welcome=true`, request.url));
      }
    } else {
      console.error("Exchange code error:", exchangeError);
    }
  }

  // Redirect to home page with error if something went wrong
  const url = new URL("/login", request.url);
  url.searchParams.set("error", "Invalid authentication code");
  return NextResponse.redirect(url);
}