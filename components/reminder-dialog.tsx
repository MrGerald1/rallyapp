"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Bell } from "lucide-react"

export function ReminderDialog() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement reminder subscription
    setIsSubmitted(true)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Bell className="mr-2 h-4 w-4" />
          Set Daily Challenge Reminder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" aria-describedby="reminder-dialog-description">
        <DialogHeader>
          <DialogTitle>Never Miss a Challenge</DialogTitle>
          <DialogDescription id="reminder-dialog-description">
            Get a daily reminder for the next year and discover what each new day brings.
          </DialogDescription>
        </DialogHeader>
        {isSubmitted ? (
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold">You&apos;re all set! 🎉</h3>
            <p className="text-sm text-muted-foreground">
              Check your email for confirmation and get ready for tomorrow&apos;s challenge at{" "}
              <a href="https://startrally.xyz" className="text-primary hover:underline">
                startrally.xyz
              </a>
              !
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Set Reminder
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
