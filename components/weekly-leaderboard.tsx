"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Medal, Users, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useChallengeStore } from "@/lib/store"

interface LeaderboardUser {
  email: string
  name: string
  points: number
  currentStreak: number
  position: number
}

interface WeeklyLeaderboardProps {
  limit?: number
  showViewAll?: boolean
  hideHeader?: boolean
}

export function WeeklyLeaderboard({ limit = 3, showViewAll = true, hideHeader = false }: WeeklyLeaderboardProps) {
  const { leaderboard, fetchLeaderboard } = useChallengeStore()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userPosition, setUserPosition] = useState<number | null>(null)
  const [userPoints, setUserPoints] = useState(0)

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get user email from localStorage
        const userEmail = localStorage.getItem("rally_user_email") || ""

        // Fetch leaderboard data
        const data = await fetchLeaderboard()

        // Find user position
        if (userEmail && data && Array.isArray(data)) {
          const userIndex = data.findIndex((entry) => entry.email === userEmail)
          if (userIndex !== -1) {
            setUserPosition(userIndex + 1)
            setUserPoints(data[userIndex].points)
          }
        }
      } catch (error) {
        console.error("Error loading leaderboard:", error)
        setError("Unable to load leaderboard at this time")
      } finally {
        setIsLoading(false)
      }
    }

    loadLeaderboard()
  }, [fetchLeaderboard])

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-[#E2F1EB] border-none">
        <div className="space-y-4 pt-4 px-6 pb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-6 w-12" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[#E2F1EB] border-none">
        <div className="pt-4 px-6 pb-6">
          <p className="text-center text-muted-foreground">{error}</p>
          <div className="flex justify-center mt-3">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (!leaderboard || !Array.isArray(leaderboard) || leaderboard.length === 0) {
    return (
      <div className="bg-[#E2F1EB] border-none">
        <div className="pt-4 px-6 pb-6">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Users className="mb-3 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">Be the first to start a streak!</p>
          </div>
        </div>
      </div>
    )
  }

  // Limit the number of entries to display
  const displayedLeaderboard = leaderboard.slice(0, limit)

  return (
    <div className="bg-[#E2F1EB] border-none">
      <div className="space-y-4 pt-4 px-6 pb-6">
        {displayedLeaderboard.map((user, index) => (
          <div
            key={index}
            className={`flex items-center space-x-3 p-2 rounded-md ${
              user.email === localStorage.getItem("rally_user_email") ? "bg-primary/10" : ""
            }`}
          >
            <div className="flex items-center justify-center w-8 h-8">
              {index === 0 ? (
                <Medal className="h-6 w-6 text-primary" />
              ) : index === 1 ? (
                <Medal className="h-6 w-6 text-gray-400" />
              ) : index === 2 ? (
                <Medal className="h-6 w-6 text-amber-700" />
              ) : (
                <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
              )}
            </div>
            <Avatar className="h-8 w-8 border">
              <AvatarFallback className="bg-primary/10 text-foreground">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.name || "User"}</p>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-bold">{user.points || 0}</span>
              <span className="text-xs text-muted-foreground">pts</span>
            </div>
          </div>
        ))}

        {/* Show user's position if not in top entries */}
        {userPosition && userPosition > limit && (
          <div className="mt-2 pt-2 border-t border-border/10">
            <div className="flex items-center space-x-3 p-2 rounded-md bg-primary/10">
              <div className="flex items-center justify-center w-8 h-8">
                <span className="text-sm font-medium text-muted-foreground">{userPosition}</span>
              </div>
              <Avatar className="h-8 w-8 border">
                <AvatarFallback className="bg-primary/10 text-foreground">
                  {localStorage.getItem("rally_user_name")?.charAt(0).toUpperCase() || "Y"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{localStorage.getItem("rally_user_name") || "You"}</p>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-bold">{userPoints}</span>
                <span className="text-xs text-muted-foreground">pts</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {showViewAll && leaderboard.length > limit && (
        <div className="flex justify-center pt-2 pb-4">
          <Button variant="ghost" asChild className="text-primary">
            <Link href="/complements" className="flex items-center">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
