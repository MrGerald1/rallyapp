"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Star, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useChallengeStore } from "@/lib/store"

export function StreakTracker() {
  const [showDialog, setShowDialog] = useState(false)
  const { streakData, fetchUserStreak, hasSubmittedToday, streakLoaded } = useChallengeStore()

  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Try to get the user's email from localStorage
    const storedEmail = localStorage.getItem("rally_user_email")
    setUserEmail(storedEmail)

    // Fetch streak data if user is logged in
    if (storedEmail) {
      fetchUserStreak(storedEmail)
    }
  }, [fetchUserStreak, hasSubmittedToday])

  // Extract streak data
  const streak = streakData?.currentStreak || 0
  const longestStreak = streakData?.longestStreak || 0
  const submissionCount = streakData?.submissionCount || 0
  const points = streakData?.points || 0

  return (
    <Card className="mb-4 overflow-hidden shadow-sm bg-[#EAF8DD] border-none rounded-lg">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
          <div className="flex items-center space-x-2">
            {streak === 0 ? (
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
            ) : (
              <Star className="h-5 w-5 text-primary flex-shrink-0" />
            )}
            <span className="font-medium">
              {streak === 0
                ? hasSubmittedToday
                  ? "Streak Starting Tomorrow"
                  : "Start Your Streak"
                : `${streak} Day${streak !== 1 ? "s" : ""} Streak`}
            </span>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => setShowDialog(true)}>
                    <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="sr-only">Streak info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">Click for streak info</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="text-xs text-muted-foreground">{streak === 0 ? "" : `${points} points`}</span>
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

        {streak === 0 && (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">
              Complete today's challenge to start your streak and earn points!
            </p>
          </div>
        )}

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

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About Streaks & Points</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Each completed day gives you 5 points. If you miss consecutive days, you lose your streak.
          </DialogDescription>
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold">Points System:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Completing a daily challenge: +5 pts</li>
              <li>Starting within 3 hrs of drop: +2 pts</li>
              <li>3-day streak bonus: +3 pts</li>
              <li>7-day streak bonus: +10 pts</li>
              <li>30-day streak bonus: +15 pts</li>
              <li>Giving compliments: +1 pt each (max 3/day)</li>
              <li>Receiving compliments: +2 pts each (max 5/day)</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
