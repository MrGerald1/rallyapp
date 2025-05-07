"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Medal, Trophy, Users, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchWeeklyLeaderboard } from "@/lib/api"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface LeaderboardUser {
  name: string
  email: string
  streak: number
  position: number
}

interface WeeklyLeaderboardProps {
  limit?: number
  showViewAll?: boolean
}

export function WeeklyLeaderboard({ limit = 3, showViewAll = true }: WeeklyLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userPosition, setUserPosition] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get user email from localStorage
        const userEmail = localStorage.getItem("rally_user_email")
        console.log("Fetching leaderboard for user:", userEmail || "anonymous")

        // Fetch leaderboard data
        const data = await fetchWeeklyLeaderboard(userEmail || "")
        console.log("Leaderboard data received:", data)

        if (data.leaderboard) {
          setLeaderboard(data.leaderboard.slice(0, limit))
          setTotalCount(data.leaderboard.length)
        } else {
          console.error("No leaderboard data in response:", data)

          // Mock data for development
          const mockLeaderboard = [
            { name: "Alex Johnson", email: "alex@example.com", streak: 7, position: 1 },
            { name: "Jamie Smith", email: "jamie@example.com", streak: 6, position: 2 },
            { name: "Taylor Brown", email: "taylor@example.com", streak: 5, position: 3 },
            { name: "Jordan Lee", email: "jordan@example.com", streak: 4, position: 4 },
            { name: "Casey Wilson", email: "casey@example.com", streak: 3, position: 5 },
          ]

          setLeaderboard(mockLeaderboard.slice(0, limit))
          setTotalCount(mockLeaderboard.length)
        }

        // Set user's position if available
        if (data.userPosition) {
          setUserPosition(data.userPosition)
        }
      } catch (error) {
        console.error("Error loading leaderboard:", error)
        setError("Unable to load leaderboard at this time")

        // Mock data for development
        const mockLeaderboard = [
          { name: "Alex Johnson", email: "alex@example.com", streak: 7, position: 1 },
          { name: "Jamie Smith", email: "jamie@example.com", streak: 6, position: 2 },
          { name: "Taylor Brown", email: "taylor@example.com", streak: 5, position: 3 },
          { name: "Jordan Lee", email: "jordan@example.com", streak: 4, position: 4 },
          { name: "Casey Wilson", email: "casey@example.com", streak: 3, position: 5 },
        ]

        setLeaderboard(mockLeaderboard.slice(0, limit))
        setTotalCount(mockLeaderboard.length)
      } finally {
        setIsLoading(false)
      }
    }

    loadLeaderboard()
  }, [limit])

  // Loading state
  if (isLoading) {
    return (
      <Card className="border border-primary/30 shadow-sm">
        <CardHeader className="border-b border-border/40 pb-3">
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-primary" />
            This Week's Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
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
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className="border border-primary/30 shadow-sm">
        <CardHeader className="border-b border-border/40 pb-3">
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-primary" />
            This Week's Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-center text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  // Empty state
  if (leaderboard.length === 0) {
    return (
      <Card className="border border-primary/30 shadow-sm">
        <CardHeader className="border-b border-border/40 pb-3">
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-primary" />
            This Week's Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Users className="mb-3 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">Be the first to start a streak!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-primary/30 shadow-sm">
      <CardHeader className="border-b border-border/40 pb-3">
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-primary" />
          This Week's Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {leaderboard.map((user, index) => (
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
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.name}</p>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-bold">{user.streak}</span>
              <span className="text-xs text-muted-foreground">days</span>
            </div>
          </div>
        ))}

        {/* Show user's position if not in top entries */}
        {userPosition && userPosition > limit && (
          <div className="mt-2 pt-2 border-t">
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
                <span className="font-bold">{localStorage.getItem("rally_streak") || "0"}</span>
                <span className="text-xs text-muted-foreground">days</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {showViewAll && totalCount > limit && (
        <CardFooter className="flex justify-center pt-2 pb-4">
          <Button variant="ghost" asChild className="text-primary">
            <Link href="/leaderboard" className="flex items-center">
              View Full Leaderboard
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
