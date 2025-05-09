import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { updateEnrollmentCurrentDay } from "@/lib/blueprint-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const blueprintId = params.id

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get the blueprint
    const { data: blueprint, error: blueprintError } = await supabase
      .from("blueprints")
      .select("*")
      .eq("id", blueprintId)
      .single()

    if (blueprintError) {
      console.error("Error fetching blueprint:", blueprintError)
      return NextResponse.json({ error: "Blueprint not found" }, { status: 404 })
    }

    // Get the user's enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("user_blueprint_enrollments")
      .select("*")
      .eq("blueprint_id", blueprintId)
      .eq("user_email", email)
      .single()

    if (enrollmentError) {
      console.error("Error fetching enrollment:", enrollmentError)
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    // Update the current day based on the blueprint start date
    const currentDay = await updateEnrollmentCurrentDay(blueprintId, enrollment.id, blueprint.start_date)

    // Get all tasks for the blueprint
    const { data: tasks, error: tasksError } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .eq("blueprint_id", blueprintId)
      .order("day_number", { ascending: true })

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError)
      return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
    }

    // Get the user's progress for all tasks
    const { data: progress, error: progressError } = await supabase
      .from("user_blueprint_task_progress")
      .select("*")
      .eq("enrollment_id", enrollment.id)

    if (progressError) {
      console.error("Error fetching progress:", progressError)
      return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
    }

    // Create a map of task ID to progress
    const progressMap = progress.reduce((acc, item) => {
      acc[item.task_id] = item
      return acc
    }, {})

    // Combine tasks with progress
    const tasksWithProgress = tasks.map((task) => ({
      ...task,
      progress: progressMap[task.id] || null,
    }))

    // Count completed tasks
    const completedCount = progress.filter((p) => p.completed).length
    const totalCount = tasks.length

    return NextResponse.json({
      enrollment,
      tasks: tasksWithProgress,
      completedCount,
      totalCount,
      currentDay,
    })
  } catch (error: any) {
    console.error("Error in GET /api/blueprints/[id]/progress:", error)
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
  }
}
