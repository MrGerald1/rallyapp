import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// Get all submissions
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("submissions").select("*").order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
  }
}

// Create a new submission
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const supabase = createServerSupabaseClient()

    const { data: newSubmission, error } = await supabase.from("submissions").insert([data]).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(newSubmission)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 })
  }
}
