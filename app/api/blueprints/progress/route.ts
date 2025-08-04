import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
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

    // Get all active enrollments for the user
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from("blueprint_enrollments")
      .select(`
        id, 
        status, 
        enrolled_at, 
        completed_at, 
        total_points,
        blueprints(id, title, description, image_url, estimated_days, category, difficulty)
      `)
      .eq("user_id", userId)
      .order("enrolled_at", { ascending: false })

    if (enrollmentsError) {
      console.error(`Error fetching enrollments for user ${userId}:`, enrollmentsError)
      return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500, headers })
    }

    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json({ enrollments: [] }, { headers })
    }

    // Get all blueprint IDs
    const blueprintIds = enrollments.map((enrollment) => enrollment.blueprints.id)

    // Get all tasks for these blueprints
    const { data: tasks, error: tasksError } = await supabase
      .from("blueprint_tasks")
      .select("id, blueprint_id")
      .in("blueprint_id", blueprintIds)

    if (tasksError) {
      console.error(`Error fetching tasks for blueprints:`, tasksError)
      return NextResponse.json({ error: "Failed to fetch blueprint tasks" }, { status: 500, headers })
    }

    // Group tasks by blueprint ID
    const tasksByBlueprint = tasks.reduce((acc, task) => {
      if (!acc[task.blueprint_id]) {
        acc[task.blueprint_id] = []
      }
      acc[task.blueprint_id].push(task.id)
      return acc
    }, {})

    // Get all task completions for the user
    const { data: completions, error: completionsError } = await supabase
      .from("blueprint_task_completions")
      .select("task_id, completed_at")
      .eq("user_id", userId)

    if (completionsError) {
      console.error(`Error fetching task completions for user ${userId}:`, completionsError)
      return NextResponse.json({ error: "Failed to fetch task completions" }, { status: 500, headers })
    }

    // Create a set of completed task IDs
    const completedTaskIds = new Set(completions.map((completion) => completion.task_id))

    // Calculate progress for each enrollment
    const enrollmentsWithProgress = enrollments.map((enrollment) => {
      const blueprintId = enrollment.blueprints.id
      const blueprintTasks = tasksByBlueprint[blueprintId] || []
      const totalTasks = blueprintTasks.length

      let completedTasks = 0
      if (totalTasks > 0) {
        completedTasks = blueprintTasks.filter((taskId) => completedTaskIds.has(taskId)).length
      }

      const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

      return {
        ...enrollment,
        progress,
        completedTasks,
        totalTasks,
      }
    })

    return NextResponse.json({ enrollments: enrollmentsWithProgress }, { headers })
  } catch (error) {
    console.error(`Unexpected error in blueprint progress route:`, error)
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
