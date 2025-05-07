"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Star, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { fetchUserStreak } from "@/lib/api"

export function StreakTracker() {
  const [streak, setStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [submissionCount, setSubmissionCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Try to get the user's email from localStorage
    const storedEmail = localStorage.getItem("rally_user_email")
    setUserEmail(storedEmail)

    if (storedEmail) {
      // Fetch streak data from the API
      setIsLoading(true)
      fetchUserStreak(storedEmail)
        .then((data) => {
          setStreak(data.currentStreak)
          setLongestStreak(data.longestStreak)
          setSubmissionCount(data.submissionCount)
        })
        .catch((error) => {
          console.error("Error fetching streak:", error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      // Fallback to local streak tracking if no email is stored
      const storedStreak = localStorage.getItem("rally_streak")
      if (storedStreak) {
        setStreak(Number.parseInt(storedStreak))
      }
      setIsLoading(false)
    }
  }, [])

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <Card className="mb-4 overflow-hidden shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-medium">Loading streak data...</span>
            </div>
          </div>
          <Progress className="mt-2" value={0} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-4 overflow-hidden border border-primary/30 shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
          <div className="flex items-center space-x-2">
            {streak === 0 ? (
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
            ) : (
              <Star className="h-5 w-5 text-primary flex-shrink-0" />
            )}
            <span className="font-medium">
              {streak === 0 ? "Start Your Streak" : `${streak} Day${streak !== 1 ? "s" : ""} of New Beginnings`}
            </span>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    {userEmail
                      ? "Rally tracks your daily adventures across all your devices."
                      : "Your streak represents the number of days in a row you've completed a challenge on Rally"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="text-xs text-muted-foreground">
            {streak === 0
              ? "Start something new today!"
              : streak === 1
                ? "Day 1 of your journey!"
                : `${streak} consecutive days of new experiences!`}
          </span>
        </div>

        {/* Show progress visualization with clear distinction between started/not started */}
        <div className="mt-3 relative">
          {streak === 0 ? (
            <div className="h-2 bg-muted rounded-md"></div>
          ) : (
            <>
              <Progress
                className="h-2 bg-muted"
                indicatorClassName="bg-primary"
                value={Math.min((streak / 7) * 100, 100)}
              />

              {/* Day markers - Mobile friendly version */}
              <div className="flex justify-between mt-1 px-1">
                {[1, 3, 5, 7].map((day) => (
                  <div
                    key={day}
                    className={`flex flex-col items-center ${day <= streak ? "text-primary" : "text-muted-foreground"}`}
                  >
                    <div className={`h-2 w-2 rounded-full ${day <= streak ? "bg-primary" : "bg-muted"}`}></div>
                    <span className="text-[10px] mt-1">Day {day}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:justify-between text-xs text-muted-foreground">
          {/* Stats section */}
          {(longestStreak > 0 || submissionCount > 0) && (
            <div className="text-right mt-1 sm:mt-0 flex-shrink-0">
              {longestStreak > 0 && (
                <p>
                  Best streak: {longestStreak} day{longestStreak !== 1 ? "s" : ""}
                </p>
              )}
              {submissionCount > 0 && <p>Total new experiences: {submissionCount}</p>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
