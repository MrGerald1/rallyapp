import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const enrollmentId = params.id

  try {
    const supabase = createRouteHandlerClient({ cookies })

    // First, get the enrollment details
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("user_blueprint_enrollments")
      .select("*")
      .eq("id", enrollmentId)
      .single()

    if (enrollmentError) {
      console.error("Error fetching enrollment:", enrollmentError)
      return NextResponse.json({ error: "Failed to fetch enrollment" }, { status: 500 })
    }

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    // Then, get the blueprint details separately
    const { data: blueprint, error: blueprintError } = await supabase
      .from("blueprints")
      .select("*")
      .eq("id", enrollment.blueprint_id)
      .single()

    if (blueprintError) {
      console.error("Error fetching blueprint:", blueprintError)
      return NextResponse.json({ error: "Failed to fetch blueprint details" }, { status: 500 })
    }

    // Get the tasks for this blueprint
    const { data: tasks, error: tasksError } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .eq("blueprint_id", enrollment.blueprint_id)
      .order("day_number", { ascending: true })

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError)
      return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
    }

    // Get the progress for this specific enrollment
    const { data: progress, error: progressError } = await supabase
      .from("user_blueprint_task_progress")
      .select("*")
      .eq("enrollment_id", enrollmentId)

    if (progressError) {
      console.error("Error fetching progress:", progressError)
      return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
    }

    // Process tasks to include progress specific to this enrollment
    const processedTasks = tasks.map((task) => {
      const taskProgress = progress.find((p) => p.task_id === task.id)
      return {
        ...task,
        progress: taskProgress || null,
      }
    })

    // Combine enrollment and blueprint data
    const enrollmentWithBlueprint = {
      ...enrollment,
      blueprint,
    }

    return NextResponse.json({
      enrollment: enrollmentWithBlueprint,
      tasks: processedTasks,
    })
  } catch (error) {
    console.error("Error fetching enrollment details:", error)
    return NextResponse.json({ error: "Failed to fetch enrollment details" }, { status: 500 })
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
export async function HEAD(request: NextRequest, { params }: { params: { id: string } }) {
  return new NextResponse(null, { status: 200 })
}
