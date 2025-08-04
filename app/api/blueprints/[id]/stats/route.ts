import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "Blueprint ID is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Verify authentication for admin stats
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Add cache control headers
    const headers = new Headers({
      "Cache-Control": "no-store, max-age=0",
      "Content-Type": "application/json",
    })

    // Get basic blueprint info
    const { data: blueprint, error: blueprintError } = await supabase
      .from("blueprints")
      .select("id, title, created_at")
      .eq("id", params.id)
      .single()

    if (blueprintError) {
      console.error(`Error fetching blueprint ${params.id}:`, blueprintError)
      return NextResponse.json({ error: "Blueprint not found" }, { status: 404, headers })
    }

    // Get enrollment count
    const { count: enrollmentCount, error: enrollmentError } = await supabase
      .from("blueprint_enrollments")
      .select("id", { count: "exact", head: true })
      .eq("blueprint_id", params.id)

    if (enrollmentError) {
      console.error(`Error counting enrollments for blueprint ${params.id}:`, enrollmentError)
      return NextResponse.json({ error: "Failed to fetch enrollment statistics" }, { status: 500, headers })
    }

    // Get completion count
    const { count: completionCount, error: completionError } = await supabase
      .from("blueprint_enrollments")
      .select("id", { count: "exact", head: true })
      .eq("blueprint_id", params.id)
      .eq("status", "completed")

    if (completionError) {
      console.error(`Error counting completions for blueprint ${params.id}:`, completionError)
      return NextResponse.json({ error: "Failed to fetch completion statistics" }, { status: 500, headers })
    }

    // Get task count
    const { count: taskCount, error: taskError } = await supabase
      .from("blueprint_tasks")
      .select("id", { count: "exact", head: true })
      .eq("blueprint_id", params.id)

    if (taskError) {
      console.error(`Error counting tasks for blueprint ${params.id}:`, taskError)
      return NextResponse.json({ error: "Failed to fetch task statistics" }, { status: 500, headers })
    }

    // Get recent enrollments (only for authenticated users)
    let recentEnrollments = []
    if (session) {
      const { data: enrollments, error: recentError } = await supabase
        .from("blueprint_enrollments")
        .select(`
          id, 
          enrolled_at, 
          status,
          profiles(id, full_name, avatar_url)
        `)
        .eq("blueprint_id", params.id)
        .order("enrolled_at", { ascending: false })
        .limit(5)

      if (!recentError) {
        recentEnrollments = enrollments
      }
    }

    // Calculate completion rate
    const completionRate = enrollmentCount > 0 ? (completionCount / enrollmentCount) * 100 : 0

    return NextResponse.json(
      {
        blueprint: {
          id: blueprint.id,
          title: blueprint.title,
          created_at: blueprint.created_at,
        },
        stats: {
          enrollmentCount,
          completionCount,
          taskCount,
          completionRate,
          recentEnrollments,
        },
      },
      { headers },
    )
  } catch (error) {
    console.error(`Unexpected error in blueprint stats route:`, error)
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
