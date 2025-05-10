import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get all enrollments for this user
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from("user_blueprint_enrollments")
      .select(`
        *,
        blueprints (*)
      `)
      .eq("user_email", email)
      .order("created_at", { ascending: false })

    if (enrollmentsError) {
      console.error("Error fetching enrollments:", enrollmentsError)
      return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
    }

    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json({ enrollments: [] })
    }

    // Get progress for all enrollments
    const enrollmentIds = enrollments.map((e) => e.id)
    const { data: progress, error: progressError } = await supabase
      .from("user_blueprint_task_progress")
      .select("*")
      .in("enrollment_id", enrollmentIds)

    if (progressError) {
      console.error("Error fetching progress:", progressError)
      return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
    }

    // Get all tasks for the blueprints
    const blueprintIds = enrollments.map((e) => e.blueprint_id)
    const { data: tasks, error: tasksError } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .in("blueprint_id", blueprintIds)

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError)
      return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
    }

    // Process enrollments to include progress and tasks
    const processedEnrollments = enrollments.map((enrollment) => {
      const enrollmentProgress = progress.filter((p) => p.enrollment_id === enrollment.id)
      const blueprintTasks = tasks.filter((t) => t.blueprint_id === enrollment.blueprint_id)

      const completedTasks = enrollmentProgress.filter((p) => p.completed).length
      const totalTasks = blueprintTasks.length
      const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

      return {
        ...enrollment,
        progress: {
          completed: completedTasks,
          total: totalTasks,
          percentage: progressPercentage,
        },
      }
    })

    return NextResponse.json({ enrollments: processedEnrollments })
  } catch (error: any) {
    console.error("Error fetching blueprint progress:", error)
    return NextResponse.json({ error: "Failed to fetch blueprint progress" }, { status: 500 })
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
