import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    console.log("GET /api/enrollments: Starting request")
    const supabase = createServerSupabaseClient()

    // Get all enrollments with blueprint details
    console.log("Querying user_blueprint_enrollments table")
    const { data: enrollments, error } = await supabase
      .from("user_blueprint_enrollments")
      .select(`
        *,
        blueprint:blueprints (
          id,
          title
        )
      `)
      .order("start_date", { ascending: false })

    if (error) {
      console.error("Error fetching enrollments:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`GET /api/enrollments: Found ${enrollments?.length || 0} enrollments`)
    return NextResponse.json({ enrollments: enrollments || [] })
  } catch (error: any) {
    console.error("Error in GET /api/enrollments:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch enrollments" }, { status: 500 })
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
