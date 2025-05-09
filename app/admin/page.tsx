"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useChallengeStore } from "@/lib/store"
import { toast } from "sonner"
import { Calendar, Edit, Trash, Check, Loader2 } from "lucide-react"

export default function AdminPage() {
  const { challenges, currentChallenge, fetchChallenges, fetchCurrentChallenge, isLoading, error } = useChallengeStore()
  const [editingChallenge, setEditingChallenge] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    hashtag: "",
    quote: "",
    author: "",
    scheduled_date: new Date().toISOString().split("T")[0],
  })
  const [actionLoading, setActionLoading] = useState(false)
  const [processingChallengeId, setProcessingChallengeId] = useState<string | null>(null)

  useEffect(() => {
    fetchChallenges()
    fetchCurrentChallenge()
  }, [fetchChallenges, fetchCurrentChallenge])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditChallenge = (challenge: any) => {
    setEditingChallenge(challenge)
    setFormData({
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      difficulty: challenge.difficulty,
      hashtag: challenge.hashtag,
      quote: challenge.quote,
      author: challenge.author,
      scheduled_date: challenge.scheduled_date,
    })
    setIsCreating(false)
  }

  const handleCreateNew = () => {
    setEditingChallenge(null)
    setFormData({
      title: "",
      description: "",
      category: "",
      difficulty: "",
      hashtag: "",
      quote: "",
      author: "",
      scheduled_date: new Date().toISOString().split("T")[0],
    })
    setIsCreating(true)
  }

  const handleCancel = () => {
    setEditingChallenge(null)
    setIsCreating(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)

    try {
      if (editingChallenge) {
        // Update existing challenge
        const response = await fetch(`/api/challenges/${editingChallenge.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Failed to update challenge")
        }

        toast.success("Challenge updated successfully")
      } else {
        // Create new challenge
        const response = await fetch("/api/challenges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Failed to create challenge")
        }

        toast.success("Challenge created successfully")
      }

      // Refresh challenges
      await fetchChallenges()
      await fetchCurrentChallenge()

      // Reset form
      setEditingChallenge(null)
      setIsCreating(false)
    } catch (error: any) {
      console.error("Error saving challenge:", error)
      toast.error(error.message || "Failed to save challenge")
    } finally {
      setActionLoading(false)
    }
  }

  const handleSetCurrent = async (challenge: any) => {
    try {
      setActionLoading(true)
      setProcessingChallengeId(challenge.id)

      const response = await fetch("/api/challenges/current", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: challenge.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to set current challenge")
      }

      toast.success("Current challenge updated successfully")
      await fetchCurrentChallenge()
    } catch (error: any) {
      console.error("Error setting current challenge:", error)
      toast.error(error.message || "Failed to set current challenge")
    } finally {
      setActionLoading(false)
      setProcessingChallengeId(null)
    }
  }

  const handleDeleteChallenge = async (id: string) => {
    if (!confirm("Are you sure you want to delete this challenge?")) {
      return
    }

    try {
      setActionLoading(true)
      setProcessingChallengeId(id)

      const response = await fetch(`/api/challenges/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete challenge")
      }

      toast.success("Challenge deleted successfully")
      await fetchChallenges()
    } catch (error: any) {
      console.error("Error deleting challenge:", error)
      toast.error(error.message || "Failed to delete challenge")
    } finally {
      setActionLoading(false)
      setProcessingChallengeId(null)
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Manage Challenges</h2>
        {!isCreating && !editingChallenge && <Button onClick={handleCreateNew}>Create New Challenge</Button>}
      </div>

      {(isCreating || editingChallenge) && (
        <Card className="mb-8">
          <CardContent className="p-4 md:p-6">
            <h3 className="text-xl font-bold mb-4">{editingChallenge ? "Edit Challenge" : "Create New Challenge"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hashtag</label>
                  <Input name="hashtag" value={formData.hashtag} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea name="description" value={formData.description} onChange={handleInputChange} required />
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wellness">Wellness</SelectItem>
                      <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                      <SelectItem value="Creativity">Creativity</SelectItem>
                      <SelectItem value="Adventure">Adventure</SelectItem>
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
                    onValueChange={(value) => handleSelectChange("difficulty", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Scheduled Date</label>
                  <Input
                    type="date"
                    name="scheduled_date"
                    value={formData.scheduled_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quote</label>
                <Textarea name="quote" value={formData.quote} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Author</label>
                <Input name="author" value={formData.author} onChange={handleInputChange} required />
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-end">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={actionLoading}>
                  {actionLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingChallenge ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editingChallenge ? "Update" : "Create"} Challenge</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <Button className="mt-4" onClick={() => fetchChallenges()}>
            Try Again
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className={currentChallenge?.id === challenge.id ? "border-primary" : ""}>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3 mb-4 sm:mb-0 sm:pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold">{challenge.title}</h3>
                      <Badge>{challenge.category}</Badge>
                      <Badge variant="outline">{challenge.difficulty}</Badge>
                      {currentChallenge?.id === challenge.id && <Badge variant="secondary">Current Challenge</Badge>}
                    </div>
                    <p className="text-muted-foreground">{challenge.description}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>{challenge.scheduled_date}</span>
                      <span className="ml-2 text-primary">{challenge.hashtag}</span>
                    </div>
                    <blockquote className="border-l-2 border-primary/20 pl-4">
                      <p className="italic">"{challenge.quote}"</p>
                      <footer className="mt-1 text-sm text-muted-foreground">— {challenge.author}</footer>
                    </blockquote>
                  </div>
                  <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
                    {currentChallenge?.id !== challenge.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetCurrent(challenge)}
                        disabled={actionLoading && processingChallengeId === challenge.id}
                      >
                        {actionLoading && processingChallengeId === challenge.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        Set Current
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditChallenge(challenge)}
                      disabled={actionLoading && processingChallengeId === challenge.id}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteChallenge(challenge.id)}
                      disabled={actionLoading && processingChallengeId === challenge.id}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
