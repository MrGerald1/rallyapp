import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(request: NextRequest, { params }: { params: { id: string; taskId: string } }) {
  try {
    if (!params.id || !params.taskId) {
      return NextResponse.json({ error: "Blueprint ID and Task ID are required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userId = session.user.id

    // Check if the user is enrolled in the blueprint
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("blueprint_enrollments")
      .select("id")
      .eq("blueprint_id", params.id)
      .eq("user_id", userId)
      .single()

    if (enrollmentError || !enrollment) {
      console.error(`User ${userId} not enrolled in blueprint ${params.id}:`, enrollmentError)
      return NextResponse.json({ error: "You must be enrolled in this blueprint to complete tasks" }, { status: 403 })
    }

    // Check if the task exists
    const { data: task, error: taskError } = await supabase
      .from("blueprint_tasks")
      .select("id, points")
      .eq("id", params.taskId)
      .eq("blueprint_id", params.id)
      .single()

    if (taskError || !task) {
      console.error(`Task ${params.taskId} not found in blueprint ${params.id}:`, taskError)
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Check if the task is already completed
    const { data: existingCompletion, error: completionError } = await supabase
      .from("blueprint_task_completions")
      .select("id")
      .eq("task_id", params.taskId)
      .eq("user_id", userId)
      .single()

    if (existingCompletion) {
      // Task already completed, return success
      return NextResponse.json({
        success: true,
        message: "Task already completed",
        completion: existingCompletion,
      })
    }

    // Parse request body for optional notes
    let notes = null
    try {
      const body = await request.json()
      notes = body.notes || null
    } catch (e) {
      // No body or invalid JSON, continue without notes
    }

    // Mark task as completed
    const { data: completion, error: insertError } = await supabase
      .from("blueprint_task_completions")
      .insert({
        task_id: params.taskId,
        user_id: userId,
        enrollment_id: enrollment.id,
        notes: notes,
        points_earned: task.points,
      })
      .select()
      .single()

    if (insertError) {
      console.error(`Error marking task ${params.taskId} as completed:`, insertError)
      return NextResponse.json({ error: "Failed to mark task as completed" }, { status: 500 })
    }

    // Update user's total points in the enrollment
    const { error: updateError } = await supabase.rpc("update_enrollment_points", {
      p_enrollment_id: enrollment.id,
    })

    if (updateError) {
      console.error(`Error updating points for enrollment ${enrollment.id}:`, updateError)
      // Continue despite the error, as the task is already marked as completed
    }

    return NextResponse.json({
      success: true,
      message: "Task marked as completed",
      completion,
    })
  } catch (error) {
    console.error(`Unexpected error in complete task route:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
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
