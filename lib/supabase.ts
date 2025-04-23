import { createClient } from "@supabase/supabase-js"

// For server-side operations
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseKey)
}

// For client-side operations - improved singleton pattern
let clientSupabaseInstance: ReturnType<typeof createClient> | null = null

export const createClientSupabaseClient = () => {
  // Only create a new instance if we're in a server context or if the instance doesn't exist yet
  if (typeof window === "undefined") {
    // Server-side - always create a new instance
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    return createClient(supabaseUrl, supabaseAnonKey)
  }

  // Client-side - use singleton pattern
  if (!clientSupabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    clientSupabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }

  return clientSupabaseInstance
}
