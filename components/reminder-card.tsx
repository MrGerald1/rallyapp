"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell } from "lucide-react"
import { useChallengeStore } from "@/lib/store"

// Function to generate ICS file content
const generateICSFile = (event: any) => {
  const { title, description, startTime, endTime, recurrence } = event

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Rally//Rally App//EN
BEGIN:VEVENT
UID:${Math.random().toString(36).substring(2, 15)}@rally.com
SUMMARY:${title}
DESCRIPTION:${description}
DTSTART:${startTime.replace(/:/g, "")}
DTEND:${endTime.replace(/:/g, "")}
RRULE:${recurrence}
END:VEVENT
END:VCALENDAR`

  return icsContent
}

// Function to generate Google Calendar URL
const generateGoogleCalendarUrl = (event: any) => {
  const { title, description, startTime, endTime, recurrence } = event

  const startDate = new Date()
  startDate.setHours(Number.parseInt(startTime.substring(0, 2)))
  startDate.setMinutes(Number.parseInt(startTime.substring(3, 5)))

  const endDate = new Date()
  endDate.setHours(Number.parseInt(endTime.substring(0, 2)))
  endDate.setMinutes(Number.parseInt(endTime.substring(3, 5)))

  const startDateString = startDate.toISOString().replace(/-|:|\.\d+/g, "")
  const endDateString = endDate.toISOString().replace(/-|:|\.\d+/g, "")

  const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE"
  const params = {
    text: title,
    details: description,
    dates: `${startDateString}/${endDateString}`,
    recur: recurrence,
  }

  const urlParams = new URLSearchParams(params)
  return `${baseUrl}&${urlParams.toString()}`
}

export function ReminderCard() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { setReminder, isLoading } = useChallengeStore()

  const handleReminder = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Save email to database
      await setReminder(email)

      // Create calendar event
      const event = {
        title: "Rally Daily Challenge",
        description: "Time for your daily challenge! Visit Rally to discover what's new today. https://startrally.xyz",
        startTime: "09:00",
        endTime: "21:00",
        recurrence: "FREQ=DAILY;COUNT=365", // Daily for 1 year
      }

      // Check if user's browser supports calendar integration
      if (navigator.share) {
        const icsFile = generateICSFile(event)
        const file = new File([icsFile], "rally-reminder.ics", { type: "text/calendar" })

        try {
          await navigator.share({
            files: [file],
          })
        } catch (shareError) {
          // Fallback to Google Calendar if share API fails
          window.open(generateGoogleCalendarUrl(event), "_blank")
        }
      } else {
        // Fallback to adding to Google Calendar
        window.open(generateGoogleCalendarUrl(event), "_blank")
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error setting reminder:", error)
    }
  }

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
      <CardContent className="p-5">
        <div className="flex items-start space-x-4">
          <Bell className="mt-1 h-5 w-5 text-primary" />
          <div className="flex-1">
            <h3 className="mb-2 font-semibold">Never Miss a Challenge!</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Set a daily reminder to discover each new mystery challenge. What will tomorrow bring?
            </p>
            {isSubmitted ? (
              <p className="text-sm font-medium text-primary">
                You&apos;re all set! Check your calendar for the daily reminder. 🎉
              </p>
            ) : (
              <form onSubmit={handleReminder} className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" variant="default" disabled={isLoading}>
                  {isLoading ? "Setting..." : "Set Reminder"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
