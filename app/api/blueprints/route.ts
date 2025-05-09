import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch blueprints
    const { data, error } = await supabase.from("blueprints").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching blueprints:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("Unexpected error in GET /api/blueprints:", error)
    return NextResponse.json({ error: "Failed to fetch blueprints" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const blueprintData = await request.json()

    // Validate required fields
    const requiredFields = ["title", "description", "duration_days", "start_date", "whatsapp_link"]
    for (const field of requiredFields) {
      if (!blueprintData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Insert blueprint
    const { data, error } = await supabase
      .from("blueprints")
      .insert({
        title: blueprintData.title,
        description: blueprintData.description,
        duration_days: blueprintData.duration_days,
        start_date: blueprintData.start_date,
        whatsapp_link: blueprintData.whatsapp_link,
        is_active: blueprintData.is_active ?? true,
      })
      .select()
      .single()

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
      Allow: "GET, POST, OPTIONS, HEAD",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, HEAD",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

// Add HEAD method to handle HEAD requests
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
