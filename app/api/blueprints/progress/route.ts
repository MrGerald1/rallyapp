import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// Get user's progress for all blueprints
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get all enrollments for this user
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from("user_blueprint_enrollments")
      .select(`
        *,
        blueprint:blueprints(*)
      `)
      .eq("user_email", email)

    if (enrollmentsError) {
      return NextResponse.json({ error: enrollmentsError.message }, { status: 500 })
    }

    // For each enrollment, get the task progress
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const { data: progress, error: progressError } = await supabase
          .from("user_blueprint_task_progress")
          .select(`
            *,
            task:blueprint_tasks(*)
          `)
          .eq("enrollment_id", enrollment.id)

        if (progressError) {
          console.error("Error fetching progress:", progressError)
          return { ...enrollment, progress: [] }
        }

        return { ...enrollment, progress }
      }),
    )

    return NextResponse.json(enrollmentsWithProgress)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
  }
}
