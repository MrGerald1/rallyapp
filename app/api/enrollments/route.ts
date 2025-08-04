import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check for authentication but don't require it
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Add cache control headers
    const headers = new Headers({
      "Cache-Control": "no-store, max-age=0",
      "Content-Type": "application/json",
    })

    // Query enrollments with blueprint information
    const { data, error } = await supabase
      .from("user_blueprint_enrollments")
      .select(`
        *,
        blueprint:blueprints!blueprint_id (
          id,
          title,
          description,
          duration_days,
          start_date,
          whatsapp_link,
          is_active,
          created_at,
          updated_at
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching enrollments:", error)
      return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500, headers })
    }

    // Format the response
    const enrollments = data.map((enrollment) => ({
      id: enrollment.id,
      user_email: enrollment.user_email,
      blueprint_id: enrollment.blueprint_id,
      project_idea: enrollment.project_idea,
      phone_number: enrollment.phone_number,
      current_day: enrollment.current_day,
      start_date: enrollment.start_date,
      completed: enrollment.completed,
      created_at: enrollment.created_at,
      updated_at: enrollment.updated_at,
      blueprint: enrollment.blueprint,
    }))

    return NextResponse.json({ enrollments }, { headers })
  } catch (error) {
    console.error("Unexpected error in enrollments route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": "*",
    },
  })
}

// Add HEAD method for health checks
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
