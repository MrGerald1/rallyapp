import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    const { data: tasks, error } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .eq("blueprint_id", params.id)
      .order("day_number", { ascending: true })

    if (error) {
      console.error("Error fetching tasks:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error in GET /api/blueprints/[id]/tasks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { data: task, error } = await supabase
      .from("blueprint_tasks")
      .insert({
        blueprint_id: params.id,
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
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating task:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error in POST /api/blueprints/[id]/tasks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
