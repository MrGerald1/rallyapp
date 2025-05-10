import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const email = searchParams.get("email")
    const blueprintId = searchParams.get("blueprint_id")

    let query = supabase.from("user_blueprint_enrollments").select(`
      *,
      blueprints (*)
    `)

    // Apply filters if provided
    if (email) {
      query = query.eq("user_email", email)
    }

    if (blueprintId) {
      query = query.eq("blueprint_id", blueprintId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching enrollments:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Unexpected error in GET /api/enrollments:", error)
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS, HEAD",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  })
}

// Add HEAD method to handle HEAD requests
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
