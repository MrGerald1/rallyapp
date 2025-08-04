import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "Enrollment ID is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Add cache control headers
    const headers = new Headers({
      "Cache-Control": "no-store, max-age=0",
      "Content-Type": "application/json",
    })

    // Get enrollment by ID
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("blueprint_enrollments")
      .select(`
        id, 
        user_id,
        blueprint_id,
        status,
        enrolled_at,
        completed_at,
        total_points,
        goals,
        expected_completion_date,
        profiles(id, full_name, email, avatar_url),
        blueprints(id, title, description, image_url, estimated_days, category, difficulty)
      `)
      .eq("id", params.id)
      .single()

    if (enrollmentError) {
      console.error(`Error fetching enrollment ${params.id}:`, enrollmentError)

      if (enrollmentError.code === "PGRST116") {
        return NextResponse.json({ error: "Enrollment not found" }, { status: 404, headers })
      }

      return NextResponse.json({ error: "Failed to fetch enrollment" }, { status: 500, headers })
    }

    // Check if user has permission to view this enrollment
    const isAdmin = session.user.app_metadata?.admin
    const isOwner = enrollment.user_id === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "You do not have permission to view this enrollment" },
        { status: 403, headers },
      )
    }

    // Get tasks for this blueprint
    const { data: tasks, error: tasksError } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .eq("blueprint_id", enrollment.blueprint_id)
      .order("order_index", { ascending: true })

    if (tasksError) {
      console.error(`Error fetching tasks for blueprint ${enrollment.blueprint_id}:`, tasksError)
      return NextResponse.json({ error: "Failed to fetch blueprint tasks" }, { status: 500, headers })
    }

    // Get task completions for this user
    const { data: completions, error: completionsError } = await supabase
      .from("blueprint_task_completions")
      .select("*")
      .eq("user_id", enrollment.user_id)
      .in(
        "task_id",
        tasks.map((task) => task.id),
      )

    if (completionsError) {
      console.error(`Error fetching task completions for user ${enrollment.user_id}:`, completionsError)
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
      return NextResponse.json({ error: "Enrollment ID is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get enrollment to check permissions
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("blueprint_enrollments")
      .select("user_id")
      .eq("id", params.id)
      .single()

    if (enrollmentError) {
      console.error(`Error fetching enrollment ${params.id}:`, enrollmentError)
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    // Check if user has permission to update this enrollment
    const isAdmin = session.user.app_metadata?.admin
    const isOwner = enrollment.user_id === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "You do not have permission to update this enrollment" }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()

    // Update the enrollment
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (body.goals !== undefined) updateData.goals = body.goals
    if (body.expected_completion_date !== undefined) updateData.expected_completion_date = body.expected_completion_date
    if (body.status !== undefined) updateData.status = body.status

    // If status is 'completed', set completed_at
    if (body.status === "completed" && !enrollment.completed_at) {
      updateData.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from("blueprint_enrollments")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating enrollment ${params.id}:`, error)
      return NextResponse.json({ error: "Failed to update enrollment" }, { status: 500 })
    }

    return NextResponse.json({ enrollment: data })
  } catch (error) {
    console.error(`Unexpected error in enrollment update route:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "Enrollment ID is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if user is admin (only admins can delete enrollments)
    const isAdmin = session.user.app_metadata?.admin
    if (!isAdmin) {
      return NextResponse.json({ error: "Only administrators can delete enrollments" }, { status: 403 })
    }

    // Delete enrollment
    const { error } = await supabase.from("blueprint_enrollments").delete().eq("id", params.id)

    if (error) {
      console.error(`Error deleting enrollment ${params.id}:`, error)
      return NextResponse.json({ error: "Failed to delete enrollment" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Unexpected error in enrollment delete route:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
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
