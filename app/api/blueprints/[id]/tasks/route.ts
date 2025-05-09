import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const blueprintId = params.id
    const supabase = createServerSupabaseClient()

    console.log(`Fetching tasks for blueprint with ID: ${blueprintId}`)

    // Fetch tasks for the blueprint without authentication requirement
    const { data, error } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .eq("blueprint_id", blueprintId)
      .order("day_number", { ascending: true })

    if (error) {
      console.error("Error fetching blueprint tasks:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("Error in GET /api/blueprints/[id]/tasks:", error)
    return NextResponse.json({ error: "Failed to fetch blueprint tasks" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const blueprintId = params.id
    const supabase = createServerSupabaseClient()
    const taskData = await request.json()

    // Validate required fields
    const requiredFields = ["day_number", "title", "instructions"]
    for (const field of requiredFields) {
      if (!taskData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Check if blueprint exists
    const { data: blueprint, error: blueprintError } = await supabase
      .from("blueprints")
      .select("id")
      .eq("id", blueprintId)
      .single()

    if (blueprintError) {
      console.error("Error checking blueprint existence:", blueprintError)
      if (blueprintError.code === "PGRST116") {
        return NextResponse.json({ error: "Blueprint not found" }, { status: 404 })
      }
      return NextResponse.json({ error: blueprintError.message }, { status: 500 })
    }

    // Check if day number is already used
    const { data: existingTask, error: existingTaskError } = await supabase
      .from("blueprint_tasks")
      .select("id")
      .eq("blueprint_id", blueprintId)
      .eq("day_number", taskData.day_number)
      .maybeSingle()

    if (existingTask) {
      return NextResponse.json({ error: `Task for day ${taskData.day_number} already exists` }, { status: 400 })
    }

    // Insert task
    const { data, error } = await supabase
      .from("blueprint_tasks")
      .insert({
        blueprint_id: blueprintId,
        day_number: taskData.day_number,
        title: taskData.title,
        instructions: taskData.instructions,
        skill_focus: taskData.skill_focus,
        examples: taskData.examples,
        story: taskData.story,
        resources: taskData.resources || [],
        share_prompt: taskData.share_prompt || false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating blueprint task:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in POST /api/blueprints/[id]/tasks:", error)
    return NextResponse.json({ error: "Failed to create blueprint task" }, { status: 500 })
  }
}
