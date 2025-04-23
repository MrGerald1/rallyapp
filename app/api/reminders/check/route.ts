import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const email = url.searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Check if the email exists in the reminders table
    const { data, error, count } = await supabase.from("reminders").select("*", { count: "exact" }).eq("email", email)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return whether the email exists
    return NextResponse.json({
      exists: count ? count > 0 : false,
      message: count && count > 0 ? "Email already registered for reminders" : "Email not registered",
    })
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
