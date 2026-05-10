import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userData } = user
    ? await supabase.from("users").select("role").eq("id", user.id).single()
    : { data: null };

  const userRole = userData?.role || null;
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ["/", "/creators", "/campaigns", "/how-it-works", "/search"];
  const authRoutes = ["/login", "/signup", "/forgot-password"];
  const dashboardRoutes = ["/dashboard"];
  const adminRoutes = ["/admin"];

  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
  const isAuthRoute = authRoutes.includes(pathname);
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");

  if (!user && (isDashboardRoute || isAdminRoute)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
  }

  if (user && isDashboardRoute && userRole) {
    const expectedPath = `/dashboard/${userRole}`;
    if (!pathname.startsWith(expectedPath) && pathname !== expectedPath) {
      return NextResponse.redirect(new URL(expectedPath, request.url));
    }
  }

  if (user && isAdminRoute && userRole !== "admin") {
    return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};