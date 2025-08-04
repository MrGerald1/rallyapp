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

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userId = session.user.id

    // Add cache control headers
    const headers = new Headers({
      "Cache-Control": "no-store, max-age=0",
      "Content-Type": "application/json",
    })

    // Get the user's enrollment details
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("blueprint_enrollments")
      .select("*, blueprints(title, description, image_url, estimated_days, category, difficulty)")
      .eq("blueprint_id", params.id)
      .eq("user_id", userId)
      .single()

    if (enrollmentError) {
      if (enrollmentError.code === "PGRST116") {
        return NextResponse.json({ error: "Enrollment not found" }, { status: 404, headers })
      }

      console.error(`Error fetching enrollment for user ${userId} in blueprint ${params.id}:`, enrollmentError)
      return NextResponse.json({ error: "Failed to fetch enrollment details" }, { status: 500, headers })
    }

    // Get the tasks for this blueprint
    const { data: tasks, error: tasksError } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .eq("blueprint_id", params.id)
      .order("order_index", { ascending: true })

    if (tasksError) {
      console.error(`Error fetching tasks for blueprint ${params.id}:`, tasksError)
      return NextResponse.json({ error: "Failed to fetch blueprint tasks" }, { status: 500, headers })
    }

    // Get the user's completed tasks
    const { data: completions, error: completionsError } = await supabase
      .from("blueprint_task_completions")
      .select("task_id, completed_at, points_earned, notes")
      .eq("user_id", userId)
      .in(
        "task_id",
        tasks.map((task) => task.id),
      )

    if (completionsError) {
      console.error(`Error fetching task completions for user ${userId}:`, completionsError)
      return NextResponse.json({ error: "Failed to fetch task completions" }, { status: 500, headers })
    }

    // Create a map of completed tasks
    const completedTasksMap = completions.reduce((map, completion) => {
      map[completion.task_id] = completion
      return map
    }, {})

    // Add completion status to each task
    const tasksWithStatus = tasks.map((task) => ({
      ...task,
      completed: !!completedTasksMap[task.id],
      completion: completedTasksMap[task.id] || null,
    }))

    return NextResponse.json(
      {
        enrollment,
        tasks: tasksWithStatus,
        completedTasks: completions.length,
        totalTasks: tasks.length,
        progress: tasks.length > 0 ? (completions.length / tasks.length) * 100 : 0,
      },
      { headers },
    )
  } catch (error) {
    console.error(`Unexpected error in enrollment details route:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "Blueprint ID is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userId = session.user.id

    // Parse request body
    const body = await request.json()

    // Get the user's enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("blueprint_enrollments")
      .select("id")
      .eq("blueprint_id", params.id)
      .eq("user_id", userId)
      .single()

    if (enrollmentError) {
      console.error(`Error fetching enrollment for user ${userId} in blueprint ${params.id}:`, enrollmentError)
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    // Update the enrollment
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (body.goals !== undefined) updateData.goals = body.goals
    if (body.expected_completion_date !== undefined) updateData.expected_completion_date = body.expected_completion_date
    if (body.status !== undefined) updateData.status = body.status

    // If status is 'completed', set completed_at
    if (body.status === "completed") {
      updateData.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from("blueprint_enrollments")
      .update(updateData)
      .eq("id", enrollment.id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating enrollment ${enrollment.id}:`, error)
      return NextResponse.json({ error: "Failed to update enrollment" }, { status: 500 })
    }

    return NextResponse.json({ enrollment: data })
  } catch (error) {
    console.error(`Unexpected error in enrollment update route:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
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
