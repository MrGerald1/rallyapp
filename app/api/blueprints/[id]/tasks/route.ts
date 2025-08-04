import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "Blueprint ID is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Fetch tasks for the blueprint, ordered by day_number
    const { data: tasks, error } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .eq("blueprint_id", params.id)
      .order("day_number", { ascending: true })

    if (error) {
      console.error(`Error fetching tasks for blueprint ${params.id}:`, error)
      return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
    }

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error(`Unexpected error in tasks route:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "Blueprint ID is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    const {
      day_number,
      title,
      instructions,
      skill_focus,
      examples,
      story,
      resources,
      share_prompt,
      requires_submission,
      submission_instructions,
    } = body

    // Validate required fields
    if (!day_number || !title || !instructions) {
      return NextResponse.json({ error: "Day number, title, and instructions are required" }, { status: 400 })
    }

    // Create new task
    const { data: task, error } = await supabase
      .from("blueprint_tasks")
      .insert({
        blueprint_id: params.id,
        day_number,
        title,
        instructions,
        skill_focus,
        examples,
        story,
        resources,
        share_prompt,
        requires_submission: requires_submission || false,
        submission_instructions,
      })
      .select()
      .single()

    if (error) {
      console.error(`Error creating task for blueprint ${params.id}:`, error)
      return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error(`Unexpected error in tasks POST route:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
