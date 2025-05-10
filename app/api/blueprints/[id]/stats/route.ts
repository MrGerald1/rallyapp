import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const blueprintId = params.id

    if (!blueprintId) {
      return NextResponse.json({ error: "Blueprint ID is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

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

    // Get all enrollments for this blueprint
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from("user_blueprint_enrollments")
      .select("*")
      .eq("blueprint_id", blueprintId)

    if (enrollmentsError) {
      console.error("Error fetching enrollments:", enrollmentsError)
      return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
    }

    // Get all tasks for this blueprint
    const { data: tasks, error: tasksError } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .eq("blueprint_id", blueprintId)

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError)
      return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
    }

    // Get all progress entries for enrollments in this blueprint
    const enrollmentIds = enrollments.map((e) => e.id)
    const { data: progress, error: progressError } = await supabase
      .from("user_blueprint_task_progress")
      .select("*")
      .in("enrollment_id", enrollmentIds)

    if (progressError) {
      console.error("Error fetching progress:", progressError)
      return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
    }

    // Calculate statistics
    const totalEnrollments = enrollments.length
    const totalTasks = tasks.length
    const totalCompletedTasks = progress.filter((p) => p.completed).length
    const averageCompletionRate = totalEnrollments > 0 ? totalCompletedTasks / (totalEnrollments * totalTasks) : 0

    // Calculate completion by day
    const completionByDay = tasks.map((task) => {
      const taskProgress = progress.filter((p) => p.task_id === task.id && p.completed)
      return {
        day: task.day_number,
        title: task.title,
        completed: taskProgress.length,
        completionRate: totalEnrollments > 0 ? taskProgress.length / totalEnrollments : 0,
      }
    })

    return NextResponse.json({
      blueprint,
      stats: {
        totalEnrollments,
        totalTasks,
        totalCompletedTasks,
        averageCompletionRate,
        completionByDay,
      },
    })
  } catch (error: any) {
    console.error("Error fetching blueprint stats:", error)
    return NextResponse.json({ error: "Failed to fetch blueprint stats" }, { status: 500 })
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
