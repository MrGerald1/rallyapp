import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string; taskId: string } }) {
  try {
    const { id: blueprintId, taskId } = params

    if (!blueprintId || !taskId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get specific task
    const { data, error } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .eq("blueprint_id", blueprintId)
      .eq("id", taskId)
      .single()

    if (error) {
      console.error("Error fetching blueprint task:", error)
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Task not found" }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Unexpected error in GET /api/blueprints/[id]/tasks/[taskId]:", error)
    return NextResponse.json({ error: "Failed to fetch blueprint task" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string; taskId: string } }) {
  try {
    const { id: blueprintId, taskId } = params

    if (!blueprintId || !taskId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const taskData = await request.json()
    const supabase = createServerSupabaseClient()

    // Update task
    const { data, error } = await supabase
      .from("blueprint_tasks")
      .update(taskData)
      .eq("blueprint_id", blueprintId)
      .eq("id", taskId)
      .select()
      .single()

    if (error) {
      console.error("Error updating blueprint task:", error)
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Task not found" }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Unexpected error in PATCH /api/blueprints/[id]/tasks/[taskId]:", error)
    return NextResponse.json({ error: "Failed to update blueprint task" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string; taskId: string } }) {
  try {
    const { id: blueprintId, taskId } = params

    if (!blueprintId || !taskId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Delete task
    const { error } = await supabase.from("blueprint_tasks").delete().eq("blueprint_id", blueprintId).eq("id", taskId)

    if (error) {
      console.error("Error deleting blueprint task:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Unexpected error in DELETE /api/blueprints/[id]/tasks/[taskId]:", error)
    return NextResponse.json({ error: "Failed to delete blueprint task" }, { status: 500 })
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS, HEAD",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  })
}

// Add HEAD method to handle HEAD requests
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
