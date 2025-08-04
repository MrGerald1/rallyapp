import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get all blueprints
    const { data, error } = await supabase.from("blueprints").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching blueprints:", error)
      return NextResponse.json({ error: "Failed to fetch blueprints" }, { status: 500 })
    }

    return NextResponse.json({ blueprints: data })
  } catch (error) {
    console.error("Unexpected error in blueprints route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Parse request body
    const body = await request.json()

    // Create new blueprint
    const { data, error } = await supabase
      .from("blueprints")
      .insert({
        title: body.title,
        description: body.description,
        duration_days: body.duration_days,
        start_date: body.start_date,
        whatsapp_link: body.whatsapp_link,
        is_active: body.is_active,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating blueprint:", error)
      return NextResponse.json({ error: "Failed to create blueprint" }, { status: 500 })
    }

    return NextResponse.json({ blueprint: data })
  } catch (error) {
    console.error("Unexpected error in blueprint creation route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
