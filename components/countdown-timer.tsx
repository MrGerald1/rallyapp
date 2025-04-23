"use client"

import { useState, useEffect } from "react"

// This component handles the countdown timer logic
// It determines if the current time is after the 9pm deadline
export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState("")
  const [afterDeadline, setAfterDeadline] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const deadline = new Date(now)
      deadline.setHours(21, 0, 0, 0) // 9 PM deadline

      // Check if current time is after deadline
      if (now > deadline) {
        setAfterDeadline(true)

        // Calculate time until next day's challenge
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(9, 0, 0, 0) // 9 AM next day

        const diff = tomorrow.getTime() - now.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        return `New challenge in ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      }

      const diff = deadline.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      return `Today's challenge ends in ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return <div className="font-semibold text-foreground md:text-lg">{timeLeft}</div>
}

// Export the isAfterDeadline check as a utility function
// This can be used by other components to determine if we're past the deadline
export function isAfterDeadline() {
  const now = new Date()
  const deadline = new Date(now)
  deadline.setHours(21, 0, 0, 0) // 9 PM
  return now > deadline
}
