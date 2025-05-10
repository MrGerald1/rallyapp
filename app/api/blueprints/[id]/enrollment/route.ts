import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const blueprintId = params.id

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    if (!blueprintId) {
      return NextResponse.json({ error: "Blueprint ID is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get enrollment for this user and blueprint
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("user_blueprint_enrollments")
      .select("*")
      .eq("user_email", email)
      .eq("blueprint_id", blueprintId)
      .maybeSingle()

    if (enrollmentError) {
      console.error("Error fetching enrollment:", enrollmentError)
      return NextResponse.json({ error: "Failed to fetch enrollment" }, { status: 500 })
    }

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    // Get blueprint details
    const { data: blueprint, error: blueprintError } = await supabase
      .from("blueprints")
      .select("*")
      .eq("id", blueprintId)
      .single()

    if (blueprintError) {
      console.error("Error fetching blueprint:", blueprintError)
      return NextResponse.json({ error: "Failed to fetch blueprint" }, { status: 500 })
    }

    // Get tasks for this blueprint
    const { data: tasks, error: tasksError } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .eq("blueprint_id", blueprintId)
      .order("day_number", { ascending: true })

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError)
      return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
    }

    // Get progress for this enrollment
    const { data: progress, error: progressError } = await supabase
      .from("user_blueprint_task_progress")
      .select("*")
      .eq("enrollment_id", enrollment.id)

    if (progressError) {
      console.error("Error fetching progress:", progressError)
      return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
    }

    // Process tasks to include progress
    const processedTasks = tasks.map((task) => {
      const taskProgress = progress.find((p) => p.task_id === task.id)
      return {
        ...task,
        progress: taskProgress || null,
      }
    })

    return NextResponse.json({
      enrollment,
      blueprint,
      tasks: processedTasks,
    })
  } catch (error: any) {
    console.error("Error fetching enrollment details:", error)
    return NextResponse.json({ error: "Failed to fetch enrollment details" }, { status: 500 })
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
