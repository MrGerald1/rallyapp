import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const blueprintId = params.id

    // Validate the blueprint ID
    if (!blueprintId) {
      return NextResponse.json({ error: "Missing blueprint ID" }, { status: 400 })
    }

    const { name, email, phone_number, project_idea } = await request.json()

    // Validate required fields
    if (!name || !email || !phone_number || !project_idea) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Check if blueprint exists and is active
    const { data: blueprint, error: blueprintError } = await supabase
      .from("blueprints")
      .select("*")
      .eq("id", blueprintId)
      .single()

    if (blueprintError || !blueprint) {
      console.error("Blueprint error:", blueprintError)
      return NextResponse.json({ error: "Blueprint not found" }, { status: 404 })
    }

    // Check if user is already enrolled
    const { data: existingEnrollment } = await supabase
      .from("user_blueprint_enrollments")
      .select("id")
      .eq("user_email", email)
      .eq("blueprint_id", blueprintId)
      .maybeSingle()

    if (existingEnrollment) {
      return NextResponse.json({ error: "You are already enrolled in this blueprint" }, { status: 400 })
    }

    // Create enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("user_blueprint_enrollments")
      .insert({
        user_email: email,
        blueprint_id: blueprintId,
        project_idea: project_idea,
        phone_number: phone_number,
        current_day: 1,
        start_date: new Date().toISOString(),
      })
      .select()
      .single()

    if (enrollmentError || !enrollment) {
      console.error("Enrollment error:", enrollmentError)
      return NextResponse.json({ error: enrollmentError?.message || "Failed to create enrollment" }, { status: 500 })
    }

    // Get all tasks for this blueprint
    const { data: tasks, error: tasksError } = await supabase
      .from("blueprint_tasks")
      .select("id")
      .eq("blueprint_id", blueprintId)

    if (tasksError) {
      console.error("Tasks error:", tasksError)
      // Continue with enrollment even if tasks fetch fails
    }

    // Create task progress entries for all tasks
    if (tasks && tasks.length > 0) {
      const progressEntries = tasks.map((task) => ({
        enrollment_id: enrollment.id,
        task_id: task.id,
        completed: false,
      }))

      const { error: progressError } = await supabase.from("user_blueprint_task_progress").insert(progressEntries)

      if (progressError) {
        console.error("Error creating task progress entries:", progressError)
        // Continue with enrollment even if progress entries fail
      }
    }

    // Return success response with community link
    return NextResponse.json({
      success: true,
      enrollment,
      communityLink: blueprint.whatsapp_link || "#",
    })
  } catch (error: any) {
    console.error("Error enrolling in blueprint:", error)
    return NextResponse.json({ error: "Failed to enroll in blueprint" }, { status: 500 })
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
