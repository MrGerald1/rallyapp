"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useChallengeStore } from "@/lib/store"
import type { Challenge } from "@/lib/store"

interface ChallengeFormProps {
  challenge?: Challenge
  onCancel: () => void
}

export function ChallengeForm({ challenge, onCancel }: ChallengeFormProps) {
  const { addChallenge, updateChallenge, isLoading } = useChallengeStore()
  const [formData, setFormData] = useState<Partial<Challenge>>(
    challenge || {
      title: "",
      description: "",
      category: "",
      difficulty: "",
      hashtag: "",
      quote: "",
      author: "",
      scheduled_date: new Date().toISOString().split("T")[0],
      is_current: false,
    },
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (challenge) {
        await updateChallenge(challenge.id, formData)
      } else {
        // When creating a new challenge, don't include an ID
        // The server will generate a unique ID
        const { id, ...newChallengeData } = formData as any
        await addChallenge(newChallengeData as Omit<Challenge, "id">)
      }
      onCancel()
    } catch (error) {
      console.error("Error saving challenge:", error)
      alert(`Error: ${error instanceof Error ? error.message : "Failed to save challenge"}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Challenge Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Hashtag</label>
          <Input
            value={formData.hashtag}
            onChange={(e) => setFormData({ ...formData, hashtag: e.target.value })}
            placeholder="#DailyChallenge"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={3}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="z-[100]">
              <SelectItem value="Photography">Photography</SelectItem>
              <SelectItem value="Wellness">Wellness</SelectItem>
              <SelectItem value="Creativity">Creativity</SelectItem>
              <SelectItem value="Adventure">Adventure</SelectItem>
              <SelectItem value="Mindfulness">Mindfulness</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Learning">Learning</SelectItem>
              <SelectItem value="Arts">Arts</SelectItem>
              <SelectItem value="Social">Social</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Difficulty</label>
          <Select
            value={formData.difficulty}
            onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent className="z-[100]">
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Schedule Date</label>
          <Input
            type="date"
            value={formData.scheduled_date}
            onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Inspirational Quote</label>
        <Textarea
          value={formData.quote}
          onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
          required
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Quote Author</label>
        <Input
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          required
        />
      </div>

      <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row sm:space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 sm:w-auto" disabled={isLoading}>
          {isLoading ? (challenge ? "Saving..." : "Creating...") : challenge ? "Save Changes" : "Create Challenge"}
        </Button>
      </div>
    </form>
  )
}
