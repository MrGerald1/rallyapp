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
        return "Today's challenge has ended"
      }

      const diff = deadline.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      return `You've got ${hours}h ${minutes}m left to try something new today!`
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every minute
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  return <div className="text-center font-semibold text-foreground md:text-lg">{timeLeft}</div>
}

// Export the isAfterDeadline check as a utility function
// This can be used by other components to determine if we're past the deadline
export function isAfterDeadline() {
  const now = new Date()
  const deadline = new Date(now)
  deadline.setHours(21, 0, 0, 0) // 9 PM
  return now > deadline
}
