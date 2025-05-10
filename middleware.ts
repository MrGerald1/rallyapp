import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Only apply to API routes
  if (path.startsWith("/api/")) {
    // Check if it's an OPTIONS request
    if (request.method === "OPTIONS") {
      // Create a new response for OPTIONS requests
      const response = new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,DELETE,PATCH,POST,PUT,OPTIONS,HEAD",
          "Access-Control-Allow-Headers":
            "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          "Access-Control-Max-Age": "86400", // 24 hours
        },
      })
      return response
    }

    // For non-OPTIONS requests
    const response = NextResponse.next()

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Credentials", "true")
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT,OPTIONS,HEAD")
    response.headers.set(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
    )

    // Add cache control headers to prevent caching
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
  }

  return NextResponse.next()
}

// Run the middleware on all routes
export const config = {
  matcher: ["/api/:path*"],
}
