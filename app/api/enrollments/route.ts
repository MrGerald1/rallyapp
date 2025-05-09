import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get all enrollments with blueprint details
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
      return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
    }

    return NextResponse.json({ enrollments })
  } catch (error) {
    console.error("Error fetching enrollments:", error)
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "GET, OPTIONS, HEAD",
      "Access-Control-Allow-Methods": "GET, OPTIONS, HEAD",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

// Add HEAD method to handle HEAD requests
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
