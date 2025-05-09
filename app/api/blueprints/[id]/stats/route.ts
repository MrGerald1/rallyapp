import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const blueprintId = params.id
    const supabase = createServerSupabaseClient()

    // Get all enrollments for this blueprint
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from("user_blueprint_enrollments")
      .select("id")
      .eq("blueprint_id", blueprintId)

    if (enrollmentsError) {
      return NextResponse.json({ error: enrollmentsError.message }, { status: 500 })
    }

    const totalEnrollments = enrollments.length

    // Get all tasks for this blueprint
    const { data: tasks, error: tasksError } = await supabase
      .from("blueprint_tasks")
      .select("id, day_number")
      .eq("blueprint_id", blueprintId)
      .order("day_number", { ascending: true })

    if (tasksError) {
      return NextResponse.json({ error: tasksError.message }, { status: 500 })
    }

    // Calculate completion rates for each day
    const dailyCompletionRates = await Promise.all(
      tasks.map(async (task) => {
        // Get all progress entries for this task
        const { data: progressEntries, error: progressError } = await supabase
          .from("user_blueprint_task_progress")
          .select("completed")
          .eq("task_id", task.id)

        if (progressError) {
          console.error("Error fetching progress for task:", progressError)
          return {
            day: task.day_number,
            completion_rate: 0,
          }
        }

        const completedCount = progressEntries.filter((entry) => entry.completed).length
        const completionRate = totalEnrollments > 0 ? (completedCount / totalEnrollments) * 100 : 0

        return {
          day: task.day_number,
          completion_rate: completionRate,
        }
      }),
    )

    // Calculate average completion rate
    const totalCompletionRate = dailyCompletionRates.reduce((sum, day) => sum + day.completion_rate, 0)
    const averageCompletionRate =
      dailyCompletionRates.length > 0 ? totalCompletionRate / dailyCompletionRates.length : 0

    return NextResponse.json({
      total_enrollments: totalEnrollments,
      average_completion_rate: averageCompletionRate,
      daily_completion_rates: dailyCompletionRates,
    })
  } catch (error: any) {
    console.error("Error fetching blueprint stats:", error)
    return NextResponse.json({ error: "Failed to fetch blueprint statistics" }, { status: 500 })
  }
}
