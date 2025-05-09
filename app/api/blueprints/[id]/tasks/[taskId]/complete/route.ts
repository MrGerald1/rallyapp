import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { recordBlueprintSubmission } from "@/lib/blueprint-submissions"
import { calculateCurrentDay } from "@/lib/blueprint-api"
import { updateEnrollmentCurrentDay } from "@/lib/blueprint-utils"

export async function POST(request: Request, { params }: { params: { id: string; taskId: string } }) {
  try {
    const { id: blueprintId, taskId } = params
    const { email, submission_data } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get the blueprint details
    const { data: blueprint, error: blueprintError } = await supabase
      .from("blueprints")
      .select("*")
      .eq("id", blueprintId)
      .single()

    if (blueprintError) {
      console.error("Error fetching blueprint:", blueprintError)
      return NextResponse.json({ error: "Blueprint not found" }, { status: 404 })
    }

    // Calculate current day based on blueprint start date
    const currentDay = calculateCurrentDay(blueprint.start_date)

    // Get the task details
    const { data: task, error: taskError } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .eq("id", taskId)
      .eq("blueprint_id", blueprintId)
      .single()

    if (taskError) {
      console.error("Error fetching task:", taskError)
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Check if the task is available based on the current day
    if (task.day_number > currentDay) {
      return NextResponse.json({ error: "This task is not yet available" }, { status: 400 })
    }

    // Get the enrollment for this user and blueprint
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

    // Check if the task is already completed
    const { data: existingProgress } = await supabase
      .from("user_blueprint_task_progress")
      .select("*")
      .eq("enrollment_id", enrollment.id)
      .eq("task_id", taskId)
      .single()

    if (existingProgress?.completed) {
      // If the task is already completed, just update the submission data
      const { data: updatedProgress, error: updateError } = await supabase
        .from("user_blueprint_task_progress")
        .update({
          submission_data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingProgress.id)
        .select()
        .single()

      if (updateError) {
        console.error("Error updating task progress:", updateError)
        return NextResponse.json({ error: "Failed to update task progress" }, { status: 500 })
      }

      // Update enrollment current day
      await updateEnrollmentCurrentDay(blueprintId, enrollment.id, blueprint.start_date)

      return NextResponse.json(updatedProgress)
    }

    // Create new progress record
    const { data: progress, error: progressError } = await supabase
      .from("user_blueprint_task_progress")
      .insert({
        enrollment_id: enrollment.id,
        task_id: taskId,
        completed: true,
        completion_date: new Date().toISOString(),
        submission_data,
      })
      .select()
      .single()

    if (progressError) {
      console.error("Error creating task progress:", progressError)
      return NextResponse.json({ error: "Failed to create task progress" }, { status: 500 })
    }

    // Update enrollment current day
    await updateEnrollmentCurrentDay(blueprintId, enrollment.id, blueprint.start_date)

    // Record this as a submission for streaks and leaderboard
    try {
      await recordBlueprintSubmission({
        userEmail: email,
        blueprintId,
        taskId,
        taskTitle: task.title,
      })
    } catch (error) {
      console.error("Error recording blueprint submission:", error)
      // Don't fail the request if this fails
    }

    return NextResponse.json(progress)
  } catch (error: any) {
    console.error("Error in POST /api/blueprints/[id]/tasks/[taskId]/complete:", error)
    return NextResponse.json({ error: "Failed to complete task" }, { status: 500 })
  }
}
