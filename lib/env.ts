// If this file exists, we need to check it for NPM_RC and NPM_TOKEN references
// Since it wasn't in the provided files, I'll create a placeholder to show what to look for

export const getClientEnv = () => {
  return {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    // Remove any references to NPM_RC and NPM_TOKEN here if they exist
  }
}
