import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  if (code) {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.app_metadata.provider === "google") {
          const { data: profile } = await supabase.from("profiles").select("registration_completed").eq("id", user.id).maybeSingle();
          if (profile && !profile.registration_completed) {
            await supabase.auth.signOut();
            return NextResponse.redirect(`${origin}/?auth_error=google_not_registered`);
          }
        }
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }
  return NextResponse.redirect(`${origin}/?auth_error=1`);
}
