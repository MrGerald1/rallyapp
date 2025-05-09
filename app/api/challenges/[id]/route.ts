import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// Get a specific challenge
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("challenges").select("*").eq("id", id).single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch challenge" }, { status: 500 })
  }
}

// Update a challenge
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()
    const supabase = createServerSupabaseClient()

    // If this challenge is set as current, update all other challenges to not be current
    if (data.is_current) {
      await supabase.from("challenges").update({ is_current: false }).not("id", "eq", id)
    }

    const { data: updatedChallenge, error } = await supabase
      .from("challenges")
      .update(data)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(updatedChallenge)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update challenge" }, { status: 500 })
  }
}

// Delete a challenge
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("challenges").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Challenge deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete challenge" }, { status: 500 })
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "GET, PUT, DELETE, OPTIONS, HEAD",
      "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS, HEAD",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

// Add HEAD method to handle HEAD requests
export async function HEAD(request: Request, { params }: { params: { id: string } }) {
  return new NextResponse(null, { status: 200 })
}
