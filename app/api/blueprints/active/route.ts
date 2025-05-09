import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Get the active blueprint
    const { data, error } = await supabase
      .from("blueprints")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("Error fetching active blueprint:", error)
      return NextResponse.json({ error: "No active blueprint found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching active blueprint:", error)
    return NextResponse.json({ error: "Failed to fetch active blueprint" }, { status: 500 })
  }
}
