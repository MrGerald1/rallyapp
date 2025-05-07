"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useChallengeStore } from "@/lib/store"

export function ComebackReminder() {
  const [email, setEmail] = useState("")
  const [reminderSet, setReminderSet] = useState(false)
  const { setReminder, isLoading } = useChallengeStore()

  const handleSetReminder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      await setReminder(email)
      setReminderSet(true)

      // Create calendar event details for tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(9, 0, 0, 0) // 9 AM tomorrow

      const endTime = new Date(tomorrow)
      endTime.setHours(21, 0, 0, 0) // 9 PM tomorrow

      const startDate = tomorrow.toISOString().replace(/-|:|\.\d+/g, "")
      const endDate = endTime.toISOString().replace(/-|:|\.\d+/g, "")

      // Create Google Calendar link with daily recurrence for a year
      const event = {
        text: "Rally Daily Challenge",
        dates: `${startDate}/${endDate}`,
        details: "Check out the new daily challenge on Rally!",
        location: "https://startrally.xyz",
        recur: "RRULE:FREQ=DAILY;COUNT=365", // Repeat daily for 1 year
      }

      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&dates=${event.dates}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}&recur=${encodeURIComponent(event.recur)}`

      // Open calendar link in new tab
      window.open(googleCalendarUrl, "_blank")
    } catch (error) {
      console.error("Error setting reminder:", error)
    }
  }

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
      <CardContent className="p-5">
        <div className="flex items-start space-x-4">
          <Sparkles className="mt-1 h-5 w-5 text-primary" />
          <div className="flex-1">
            <h3 className="mb-2 font-semibold">Don't Miss Tomorrow's Challenge!</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Set a daily reminder and build your streak of trying new things. What will tomorrow bring?
            </p>
            {reminderSet ? (
              <div className="text-center">
                <p className="text-sm font-medium text-primary">
                  You're all set! We'll remind you about tomorrow's challenge. 🎉
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Come back tomorrow to discover a new challenge and continue your journey.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSetReminder} className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" variant="default" disabled={isLoading}>
                  <Bell className="mr-2 h-4 w-4" />
                  {isLoading ? "Setting..." : "Remind Me"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
