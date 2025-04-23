import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import type { Database } from "@/lib/database.types"

const supabase = createRouteHandlerClient<Database>({ cookies })

export async function POST(req: Request) {
  try {
    const { senderEmail, recipientEmail, message, submissionId } = await req.json()

    // Validate required fields
    if (!senderEmail || !recipientEmail || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert the complement
    const { data, error } = await supabase
      .from("complements")
      .insert({
        sender_email: senderEmail,
        recipient_email: recipientEmail,
        message,
        submission_id: submissionId ? submissionId : null, // Make submission_id nullable or handle UUID properly
      })
      .select()

    if (error) {
      console.error("Error creating complement:", error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true, data })
  } catch (error) {
    console.error("Error in complement route:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
