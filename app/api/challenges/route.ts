import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// Get all challenges
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("challenges").select("*").order("scheduled_date", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch challenges" }, { status: 500 })
  }
}

// Create a new challenge
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const supabase = createServerSupabaseClient()

    // Generate a smaller integer ID that fits within PostgreSQL's integer range
    // Use the last 7 digits of the current timestamp (will still be unique enough)
    const timestamp = Date.now().toString()
    const numericId = Number.parseInt(timestamp.substring(timestamp.length - 7), 10)

    // Add the ID to the data
    const challengeData = {
      ...data,
      id: numericId,
      created_at: new Date().toISOString(),
    }

    // If this challenge is set as current, update all other challenges to not be current
    if (data.is_current) {
      await supabase.from("challenges").update({ is_current: false }).not("id", "eq", numericId)
    }

    const { data: newChallenge, error } = await supabase.from("challenges").insert([challengeData]).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(newChallenge)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create challenge" }, { status: 500 })
  }
}
