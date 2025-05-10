import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const blueprintId = params.id
    console.log(`POST /api/blueprints/${blueprintId}/enroll: Starting request`)

    // Validate the blueprint ID
    if (!blueprintId) {
      return NextResponse.json({ error: "Missing blueprint ID" }, { status: 400 })
    }

    // Parse request body
    let requestBody
    try {
      requestBody = await request.json()
      console.log("Request body:", requestBody)
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { name, email, phone_number, project_idea } = requestBody

    // Validate required fields
    if (!name || !email || !phone_number || !project_idea) {
      console.error("Missing required fields:", { name, email, phone_number, project_idea })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Check if blueprint exists and is active
    console.log(`Checking if blueprint ${blueprintId} exists`)
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
    console.log(`Checking if user ${email} is already enrolled in blueprint ${blueprintId}`)
    const { data: existingEnrollment, error: enrollmentCheckError } = await supabase
      .from("user_blueprint_enrollments")
      .select("id")
      .eq("user_email", email)
      .eq("blueprint_id", blueprintId)
      .maybeSingle()

    if (enrollmentCheckError) {
      console.error("Error checking existing enrollment:", enrollmentCheckError)
      // Continue with enrollment attempt
    }

    if (existingEnrollment) {
      console.log(`User ${email} is already enrolled in blueprint ${blueprintId}`)
      return NextResponse.json({ error: "You are already enrolled in this blueprint" }, { status: 400 })
    }

    // Create enrollment
    console.log(`Creating enrollment for user ${email} in blueprint ${blueprintId}`)
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

    console.log(`Successfully created enrollment:`, enrollment)

    // Get all tasks for this blueprint
    console.log(`Fetching tasks for blueprint ${blueprintId}`)
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
      console.log(`Creating progress entries for ${tasks.length} tasks`)
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
    console.log(`POST /api/blueprints/${blueprintId}/enroll: Completed successfully`)
    return NextResponse.json({
      success: true,
      enrollment,
      communityLink: blueprint.whatsapp_link || "#",
    })
  } catch (error: any) {
    console.error("Error enrolling in blueprint:", error)
    return NextResponse.json({ error: error.message || "Failed to enroll in blueprint" }, { status: 500 })
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
