import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: { id: string; taskId: string } }) {
  try {
    if (!params.id || !params.taskId) {
      return NextResponse.json({ error: "Blueprint ID and Task ID are required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    const { data: task, error } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .eq("id", params.taskId)
      .eq("blueprint_id", params.id)
      .single()

    if (error) {
      console.error(`Error fetching task ${params.taskId}:`, error)
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error(`Unexpected error in task GET route:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string; taskId: string } }) {
  try {
    if (!params.id || !params.taskId) {
      return NextResponse.json({ error: "Blueprint ID and Task ID are required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    const { data: task, error } = await supabase
      .from("blueprint_tasks")
      .update(body)
      .eq("id", params.taskId)
      .eq("blueprint_id", params.id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating task ${params.taskId}:`, error)
      return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error(`Unexpected error in task PATCH route:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string; taskId: string } }) {
  try {
    if (!params.id || !params.taskId) {
      return NextResponse.json({ error: "Blueprint ID and Task ID are required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    const { error } = await supabase
      .from("blueprint_tasks")
      .delete()
      .eq("id", params.taskId)
      .eq("blueprint_id", params.id)

    if (error) {
      console.error(`Error deleting task ${params.taskId}:`, error)
      return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Unexpected error in task DELETE route:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
