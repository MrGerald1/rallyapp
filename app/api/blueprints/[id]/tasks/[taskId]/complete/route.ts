import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request, { params }: { params: { id: string; taskId: string } }) {
  try {
    const { id: blueprintId, taskId } = params

    if (!blueprintId || !taskId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const { enrollmentId, submission } = await request.json()

    if (!enrollmentId) {
      return NextResponse.json({ error: "Missing enrollment ID" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Check if task exists
    const { data: task, error: taskError } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .eq("blueprint_id", blueprintId)
      .eq("id", taskId)
      .single()

    if (taskError) {
      console.error("Error fetching task:", taskError)
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Check if enrollment exists
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("user_blueprint_enrollments")
      .select("*")
      .eq("id", enrollmentId)
      .eq("blueprint_id", blueprintId)
      .single()

    if (enrollmentError) {
      console.error("Error fetching enrollment:", enrollmentError)
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    // Check if progress entry exists
    const { data: existingProgress, error: progressError } = await supabase
      .from("user_blueprint_task_progress")
      .select("*")
      .eq("enrollment_id", enrollmentId)
      .eq("task_id", taskId)
      .maybeSingle()

    if (progressError) {
      console.error("Error fetching progress:", progressError)
      return NextResponse.json({ error: "Failed to check progress" }, { status: 500 })
    }

    let progressData

    if (existingProgress) {
      // Update existing progress
      const { data, error } = await supabase
        .from("user_blueprint_task_progress")
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          submission_data: submission || null,
        })
        .eq("id", existingProgress.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating progress:", error)
        return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
      }

      progressData = data
    } else {
      // Create new progress entry
      const { data, error } = await supabase
        .from("user_blueprint_task_progress")
        .insert({
          enrollment_id: enrollmentId,
          task_id: taskId,
          completed: true,
          completed_at: new Date().toISOString(),
          submission_data: submission || null,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating progress:", error)
        return NextResponse.json({ error: "Failed to create progress" }, { status: 500 })
      }

      progressData = data
    }

    // Update enrollment current_day if needed
    if (task.day_number >= enrollment.current_day) {
      const { error: updateError } = await supabase
        .from("user_blueprint_enrollments")
        .update({
          current_day: task.day_number + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", enrollmentId)

      if (updateError) {
        console.error("Error updating enrollment:", updateError)
        // Continue even if this fails
      }
    }

    return NextResponse.json({
      success: true,
      progress: progressData,
    })
  } catch (error: any) {
    console.error("Error completing task:", error)
    return NextResponse.json({ error: "Failed to complete task" }, { status: 500 })
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS, HEAD",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  })
}

// Add HEAD method to handle HEAD requests
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
