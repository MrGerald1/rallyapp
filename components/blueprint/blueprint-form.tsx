"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Blueprint } from "@/lib/models/blueprint"

interface BlueprintFormProps {
  blueprint?: Blueprint
  isEdit?: boolean
}

export function BlueprintForm({ blueprint, isEdit = false }: BlueprintFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<Blueprint>>(
    blueprint || {
      title: "",
      description: "",
      duration_days: 26,
      start_date: new Date().toISOString().split("T")[0],
      whatsapp_link: "",
      is_active: true,
    },
  )

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = isEdit ? `/api/blueprints/${blueprint?.id}` : "/api/blueprints"
      const method = isEdit ? "PATCH" : "POST"

      console.log("Submitting form:", { url, method, formData })

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error response:", errorData)
        throw new Error(errorData.error || `Failed to ${isEdit ? "update" : "create"} blueprint: ${response.status}`)
      }

      const data = await response.json()
      console.log("Success response:", data)

      toast.success(isEdit ? "Blueprint updated successfully" : "Blueprint created successfully")
      router.push("/admin/blueprints")
    } catch (error: any) {
      console.error("Error saving blueprint:", error)
      toast.error(error.message || "Failed to save blueprint")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Blueprint Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., 26-Day Idea Launch Blueprint"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe what this blueprint program is about..."
          rows={4}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="duration_days">Duration (Days)</Label>
          <Input
            id="duration_days"
            name="duration_days"
            type="number"
            min="1"
            value={formData.duration_days}
            onChange={handleNumberChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            value={formData.start_date?.toString().split("T")[0]}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp_link">WhatsApp Group Link</Label>
        <Input
          id="whatsapp_link"
          name="whatsapp_link"
          value={formData.whatsapp_link}
          onChange={handleChange}
          placeholder="https://chat.whatsapp.com/..."
          required
        />
        <p className="text-xs text-muted-foreground">
          Create a WhatsApp group for this blueprint cohort and paste the invite link here.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex space-x-2">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/blueprints")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{isEdit ? "Update" : "Create"} Blueprint</>
          )}
        </Button>
      </div>
    </form>
  )
}
