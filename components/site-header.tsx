"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, Users } from "lucide-react"

export function SiteHeader() {
  const [complimentCount, setComplimentCount] = useState(0)

  // Fetch compliment count on component mount
  useEffect(() => {
    const fetchComplimentCount = async () => {
      try {
        // Get user email from localStorage
        const email = localStorage.getItem("rally_user_email")
        if (!email) return

        const response = await fetch(`/api/complements?email=${email}&unread=true`)
        if (response.ok) {
          const data = await response.json()
          setComplimentCount(data.length || 0)
        }
      } catch (error) {
        console.error("Error fetching compliment count:", error)
      }
    }

    fetchComplimentCount()

    // Set up polling to check for new compliments every minute
    const interval = setInterval(fetchComplimentCount, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
            <span className="font-bold">Rally</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/why" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Why Rally?
          </Link>
          <Link
            href="/partner"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Partner
          </Link>
          <Link
            href="/my-compliments"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary relative"
          >
            My Compliments
            {complimentCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {complimentCount > 9 ? "9+" : complimentCount}
              </span>
            )}
          </Link>
          <Link
            href="https://chat.whatsapp.com/HsIgtz1Ge0MFryTkAVjnIy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <Users className="inline-block mr-1 h-4 w-4" />
            Join Community
          </Link>
        </nav>
        <div className="flex md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
                <Menu className="h-5 w-5" />
                {complimentCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {complimentCount > 9 ? "9+" : complimentCount}
                  </span>
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/why">Why Rally?</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/partner">Partner</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/my-compliments" className="flex items-center">
                  My Compliments
                  {complimentCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {complimentCount > 9 ? "9+" : complimentCount}
                    </span>
                  )}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="https://chat.whatsapp.com/HsIgtz1Ge0MFryTkAVjnIy" target="_blank" rel="noopener noreferrer">
                  <Users className="mr-2 h-4 w-4" />
                  Join Community
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
