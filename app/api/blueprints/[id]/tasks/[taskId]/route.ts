import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string; taskId: string } }) {
  try {
    const supabase = createClient()

    const { data: task, error } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .eq("id", params.taskId)
      .eq("blueprint_id", params.id)
      .single()

    if (error) {
      console.error("Error fetching task:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error in GET /api/blueprints/[id]/tasks/[taskId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string; taskId: string } }) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { data: task, error } = await supabase
      .from("blueprint_tasks")
      .update({
        day_number: body.day_number,
        title: body.title,
        instructions: body.instructions,
        skill_focus: body.skill_focus,
        examples: body.examples,
        story: body.story,
        resources: body.resources,
        share_prompt: body.share_prompt,
        requires_submission: body.requires_submission || false,
        submission_instructions: body.submission_instructions,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.taskId)
      .eq("blueprint_id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating task:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error in PATCH /api/blueprints/[id]/tasks/[taskId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string; taskId: string } }) {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from("blueprint_tasks")
      .delete()
      .eq("id", params.taskId)
      .eq("blueprint_id", params.id)

    if (error) {
      console.error("Error deleting task:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/blueprints/[id]/tasks/[taskId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
