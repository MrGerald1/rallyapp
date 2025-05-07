import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// Get current challenge
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // First try to get the challenge marked as current
    let { data, error } = await supabase.from("challenges").select("*").eq("is_current", true).single()

    // If no challenge is marked as current, get the one scheduled for today
    if (error || !data) {
      const today = new Date().toISOString().split("T")[0]

      const { data: todayChallenge, error: todayError } = await supabase
        .from("challenges")
        .select("*")
        .eq("scheduled_date", today)
        .single()

      if (todayError || !todayChallenge) {
        // If no challenge for today, get the most recent one
        const { data: latestChallenge, error: latestError } = await supabase
          .from("challenges")
          .select("*")
          .order("scheduled_date", { ascending: false })
          .limit(1)
          .single()

        if (latestError) {
          return NextResponse.json({ error: "No challenges found" }, { status: 404 })
        }

        data = latestChallenge
      } else {
        data = todayChallenge
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch current challenge" }, { status: 500 })
  }
}

// Set current challenge
export async function POST(request: Request) {
  try {
    const { id } = await request.json()
    const supabase = createServerSupabaseClient()

    // First, set all challenges to not current
    await supabase.from("challenges").update({ is_current: false }).neq("id", id)

    // Then set the specified challenge as current
    const { data, error } = await supabase
      .from("challenges")
      .update({ is_current: true })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to set current challenge" }, { status: 500 })
  }
}
