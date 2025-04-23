"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"

export function ReminderSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <div className="rounded-lg bg-yellow-50/50 p-4">
      <div className="mb-3 flex items-start space-x-3">
        <Calendar className="h-5 w-5 text-yellow-600" />
        <div>
          <h3 className="font-semibold">Never Miss a Challenge!</h3>
          <p className="text-sm text-muted-foreground">
            Set a daily reminder to discover each new mystery challenge. What will tomorrow bring?
          </p>
        </div>
      </div>

      {isSubmitted ? (
        <div className="text-center">
          <p className="text-sm font-medium text-green-600">
            You&apos;re all set! Check your email for confirmation. 🎉
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 flex space-x-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white"
            required
          />
          <Button type="submit" className="bg-black text-white hover:bg-gray-800">
            Remind Me
          </Button>
        </form>
      )}
    </div>
  )
}
