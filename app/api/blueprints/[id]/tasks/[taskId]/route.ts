import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string; taskId: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const blueprintId = params.id
    const taskId = params.taskId

    // Fetch task without authentication requirement
    console.log(`Fetching task with ID: ${taskId} for blueprint with ID: ${blueprintId}`)

    const { data, error } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .eq("id", taskId)
      .eq("blueprint_id", blueprintId)
      .single()

    if (error) {
      console.error("Error fetching task:", error)
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Task not found" }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in GET /api/blueprints/[id]/tasks/[taskId]:", error)
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string; taskId: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const blueprintId = params.id
    const taskId = params.taskId
    const taskData = await request.json()

    console.log(`Updating task with ID: ${taskId} for blueprint with ID: ${blueprintId}`, taskData)

    // If day_number is being updated, check if it's already used
    if (taskData.day_number) {
      const { data: existingTask, error: existingTaskError } = await supabase
        .from("blueprint_tasks")
        .select("id")
        .eq("blueprint_id", blueprintId)
        .eq("day_number", taskData.day_number)
        .neq("id", taskId)
        .maybeSingle()

      if (existingTask) {
        return NextResponse.json({ error: `Task for day ${taskData.day_number} already exists` }, { status: 400 })
      }
    }

    // Update task
    const { data, error } = await supabase
      .from("blueprint_tasks")
      .update({
        ...taskData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .eq("blueprint_id", blueprintId)
      .select()
      .single()

    if (error) {
      console.error("Error updating task:", error)
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Task not found" }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in PUT /api/blueprints/[id]/tasks/[taskId]:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string; taskId: string } }) {
  // Redirect PATCH requests to PUT for compatibility
  return PUT(request, { params })
}

export async function DELETE(request: Request, { params }: { params: { id: string; taskId: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const blueprintId = params.id
    const taskId = params.taskId

    console.log(`Deleting task with ID: ${taskId} for blueprint with ID: ${blueprintId}`)

    // Delete task
    const { error } = await supabase.from("blueprint_tasks").delete().eq("id", taskId).eq("blueprint_id", blueprintId)

    if (error) {
      console.error("Error deleting task:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in DELETE /api/blueprints/[id]/tasks/[taskId]:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
