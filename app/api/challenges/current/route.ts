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
    console.error("Error in GET /api/challenges/current:", error)
    return NextResponse.json({ error: "Failed to fetch current challenge" }, { status: 500 })
  }
}

// Set current challenge
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      console.error("Missing challenge ID in request body")
      return NextResponse.json({ error: "Challenge ID is required" }, { status: 400 })
    }

    console.log(`Setting challenge ${id} as current...`)

    const supabase = createServerSupabaseClient()

    // First, verify the challenge exists
    const { data: challengeExists, error: challengeError } = await supabase
      .from("challenges")
      .select("id")
      .eq("id", id)
      .single()

    if (challengeError || !challengeExists) {
      console.error(`Challenge with ID ${id} not found:`, challengeError)
      return NextResponse.json({ error: `Challenge with ID ${id} not found` }, { status: 404 })
    }

    // First, set all challenges to not current
    console.log("Resetting all challenges to not current...")
    const { error: resetError } = await supabase.from("challenges").update({ is_current: false }).neq("id", id)

    if (resetError) {
      console.error("Error resetting current challenges:", resetError)
      return NextResponse.json({ error: resetError.message }, { status: 500 })
    }

    // Then set the specified challenge as current
    console.log(`Setting challenge ${id} as current...`)
    const { data, error } = await supabase
      .from("challenges")
      .update({ is_current: true })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error setting current challenge:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Successfully set current challenge:", data)
    return NextResponse.json({
      success: true,
      message: "Challenge set as current successfully",
      data,
    })
  } catch (error) {
    console.error("Unexpected error in POST /api/challenges/current:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to set current challenge",
      },
      { status: 500 },
    )
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "GET, POST, OPTIONS",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  })
}
