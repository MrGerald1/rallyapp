"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, Trash } from "lucide-react"
import type { BlueprintTask, Resource } from "@/lib/types"
import { TiptapEditor } from "@/lib/tiptap-editor"
import { toast } from "sonner"

interface TaskFormProps {
  task?: BlueprintTask
  onSubmit: (taskData: Partial<BlueprintTask>) => void
  onCancel: () => void
  existingDayNumbers: number[]
  maxDays: number
}

export function TaskForm({ task, onSubmit, onCancel, existingDayNumbers, maxDays }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<BlueprintTask>>(
    task || {
      day_number: getNextAvailableDay(existingDayNumbers, maxDays),
      title: "",
      instructions: "",
      skill_focus: "",
      examples: "",
      story: "",
      resources: [],
      share_prompt: false,
      requires_submission: false,
      submission_instructions: "",
    },
  )
  const [resourceTitle, setResourceTitle] = useState("")
  const [resourceUrl, setResourceUrl] = useState("")
  const [resourceType, setResourceType] = useState<"article" | "video" | "template" | "tool" | "other">("article")

  function getNextAvailableDay(existingDays: number[], maxDays: number): number {
    for (let i = 1; i <= maxDays; i++) {
      if (!existingDays.includes(i)) {
        return i
      }
    }
    return 1 // Default to day 1 if all days are taken (shouldn't happen)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleAddResource = () => {
    if (!resourceTitle || !resourceUrl) return

    const newResource: Resource = {
      title: resourceTitle,
      url: resourceUrl,
      type: resourceType,
    }

    setFormData((prev) => ({
      ...prev,
      resources: [...(prev.resources || []), newResource],
    }))

    // Clear the form
    setResourceTitle("")
    setResourceUrl("")
    setResourceType("article")
  }

  const handleRemoveResource = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      resources: (prev.resources || []).filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Ensure required fields are present
      if (!formData.day_number || !formData.title || !formData.instructions) {
        toast.error("Please fill in all required fields: Day Number, Title, and Instructions")
        setIsSubmitting(false)
        return
      }

      console.log("Submitting task form:", formData)
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="day_number">Day Number</Label>
          <Input
            id="day_number"
            name="day_number"
            type="number"
            min="1"
            max={maxDays}
            value={formData.day_number}
            onChange={handleNumberChange}
          />
          <p className="text-xs text-muted-foreground">Day number must be unique for this blueprint (1-{maxDays})</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Define Your Idea"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Instructions</Label>
        <TiptapEditor
          content={formData.instructions || ""}
          onChange={(content) => setFormData((prev) => ({ ...prev, instructions: content }))}
          placeholder="Detailed instructions for the task..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skill_focus">Skill Focus</Label>
        <Input
          id="skill_focus"
          name="skill_focus"
          value={formData.skill_focus}
          onChange={handleChange}
          placeholder="e.g., Market Research"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="examples">Context & Examples</Label>
        <TiptapEditor
          content={formData.examples || ""}
          onChange={(content) => setFormData((prev) => ({ ...prev, examples: content }))}
          placeholder="Provide examples relevant to the context..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="story">Inspirational Story</Label>
        <TiptapEditor
          content={formData.story || ""}
          onChange={(content) => setFormData((prev) => ({ ...prev, story: content }))}
          placeholder="Share an inspirational story related to this task..."
        />
      </div>

      <div className="space-y-2">
        <Label>Resources</Label>
        <div className="rounded-lg border p-4">
          <div className="space-y-4">
            {/* Current resources */}
            {formData.resources && formData.resources.length > 0 && (
              <div className="space-y-2">
                <Label>Current Resources:</Label>
                <ul className="space-y-2">
                  {formData.resources.map((resource, index) => (
                    <li key={index} className="flex items-center justify-between rounded-md border p-2">
                      <div>
                        <span className="font-medium">{resource.title}</span>
                        <span className="ml-2 text-xs text-muted-foreground">({resource.type})</span>
                        <div className="text-xs text-blue-500">{resource.url}</div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveResource(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add new resource */}
            <div className="space-y-2">
              <Label>Add Resource:</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  placeholder="Resource Title"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                />
                <Input placeholder="URL" value={resourceUrl} onChange={(e) => setResourceUrl(e.target.value)} />
              </div>
              <div className="flex items-center justify-between">
                <Select value={resourceType} onValueChange={(value) => setResourceType(value as any)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Resource Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="tool">Tool</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" size="sm" onClick={handleAddResource}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Resource
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="share_prompt"
            checked={formData.share_prompt}
            onCheckedChange={(checked) => handleSwitchChange("share_prompt", checked)}
          />
          <Label htmlFor="share_prompt">Encourage participants to share their progress</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="requires_submission"
            checked={formData.requires_submission}
            onCheckedChange={(checked) => handleSwitchChange("requires_submission", checked)}
          />
          <Label htmlFor="requires_submission">Require submission to complete this task</Label>
        </div>

        {formData.requires_submission && (
          <div className="space-y-2 mt-2 pl-6">
            <Label htmlFor="submission_instructions">Submission Instructions</Label>
            <TiptapEditor
              content={formData.submission_instructions || ""}
              onChange={(content) => setFormData((prev) => ({ ...prev, submission_instructions: content }))}
              placeholder="Instructions for what users should submit..."
            />
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {task ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{task ? "Update" : "Create"} Task</>
          )}
        </Button>
      </div>
    </form>
  )
}
