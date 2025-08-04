"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface TaskFormProps {
  blueprintId: string
  task?: any
  isEditing?: boolean
}

export function TaskForm({ blueprintId, task, isEditing = false }: TaskFormProps) {
  const [formData, setFormData] = useState({
    day_number: task?.day_number || 1,
    title: task?.title || "",
    instructions: task?.instructions || "",
    skill_focus: task?.skill_focus || "",
    examples: task?.examples || "",
    story: task?.story || "",
    resources: task?.resources || "",
    share_prompt: task?.share_prompt || "",
    requires_submission: task?.requires_submission || false,
    submission_instructions: task?.submission_instructions || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url =
        isEditing && task ? `/api/blueprints/${blueprintId}/tasks/${task.id}` : `/api/blueprints/${blueprintId}/tasks`

      const method = isEditing ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save task")
      }

      toast({
        title: "Success",
        description: isEditing ? "Task updated successfully" : "Task created successfully",
      })

      router.push(`/admin/blueprints/${blueprintId}/tasks`)
    } catch (err: any) {
      console.error("Error saving task:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to save task",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Task" : "Create Task"}</CardTitle>
          <CardDescription>
            {isEditing ? "Update the details of your existing task" : "Create a new task for your blueprint"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="day_number">Day Number</Label>
            <Input
              id="day_number"
              name="day_number"
              type="number"
              min="1"
              value={formData.day_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Enter task instructions"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill_focus">Skill Focus</Label>
            <Input
              id="skill_focus"
              name="skill_focus"
              value={formData.skill_focus}
              onChange={handleChange}
              placeholder="Enter the skill focus for this task"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="examples">Examples</Label>
            <Textarea
              id="examples"
              name="examples"
              value={formData.examples}
              onChange={handleChange}
              placeholder="Provide examples for this task"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="story">Inspirational Story</Label>
            <Textarea
              id="story"
              name="story"
              value={formData.story}
              onChange={handleChange}
              placeholder="Share an inspirational story related to this task"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resources">Resources</Label>
            <Textarea
              id="resources"
              name="resources"
              value={formData.resources}
              onChange={handleChange}
              placeholder="Add resources (links, articles, etc.)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="share_prompt">Share Prompt</Label>
            <Textarea
              id="share_prompt"
              name="share_prompt"
              value={formData.share_prompt}
              onChange={handleChange}
              placeholder="Prompt for users to share their work"
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="requires_submission"
              name="requires_submission"
              checked={formData.requires_submission}
              onChange={handleChange}
              className="rounded border-gray-300"
            />
            <Label htmlFor="requires_submission">Requires Submission</Label>
          </div>

          {formData.requires_submission && (
            <div className="space-y-2">
              <Label htmlFor="submission_instructions">Submission Instructions</Label>
              <Textarea
                id="submission_instructions"
                name="submission_instructions"
                value={formData.submission_instructions}
                onChange={handleChange}
                placeholder="Instructions for what users should submit"
                rows={3}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : isEditing ? (
              "Update Task"
            ) : (
              "Create Task"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
