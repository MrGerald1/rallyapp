import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const active = searchParams.get("active")

    let query = supabase.from("blueprints").select("*")

    // Apply filters if provided
    if (active === "true") {
      query = query.eq("is_active", true)
    }

    // Order by created_at descending
    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error("Error fetching blueprints:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Unexpected error in GET /api/blueprints:", error)
    return NextResponse.json({ error: "Failed to fetch blueprints" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const blueprintData = await request.json()

    // Add timestamps
    const now = new Date().toISOString()
    blueprintData.created_at = now
    blueprintData.updated_at = now

    const { data, error } = await supabase.from("blueprints").insert(blueprintData).select().single()

    if (error) {
      console.error("Error creating blueprint:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Unexpected error in POST /api/blueprints:", error)
    return NextResponse.json({ error: "Failed to create blueprint" }, { status: 500 })
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, HEAD",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  })
}

// Add HEAD method to handle HEAD requests
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
