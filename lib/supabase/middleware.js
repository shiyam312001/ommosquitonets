import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const path = request.nextUrl.pathname;

  // Redirect old /admin URLs to /manage
  if (path.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = path.replace(/^\/admin/, "/manage");
    return NextResponse.redirect(url);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isManageLogin = path === "/manage/login";
  const isManageRoute = path.startsWith("/manage");

  if (isManageRoute && !isManageLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/manage/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  if (isManageRoute && !isManageLogin && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/manage/login";
      url.searchParams.set("error", "access_denied");
      return NextResponse.redirect(url);
    }
  }

  if (path.startsWith("/account") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  if (path.startsWith("/checkout") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("redirect", "/checkout");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
