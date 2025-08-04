"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle, Lock, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { completeTask, uploadBlueprintSubmission } from "@/lib/api/blueprint-api"
import type { BlueprintTask, BlueprintTaskProgress } from "@/lib/types/blueprint"

interface TaskCardProps {
  task: BlueprintTask & { progress?: BlueprintTaskProgress | null }
  enrollmentId: string
  blueprintId: string
  isUnlocked: boolean
  isCurrentDay: boolean
  onTaskCompleted?: () => void
}

export function TaskCard({
  task,
  enrollmentId,
  blueprintId,
  isUnlocked,
  isCurrentDay,
  onTaskCompleted,
}: TaskCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionText, setSubmissionText] = useState("")
  const [submissionFile, setSubmissionFile] = useState<File | null>(null)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)

  const isCompleted = task.progress?.completed || false

  const handleSubmit = async () => {
    if (!isUnlocked) {
      toast.error("This task is not yet available")
      return
    }

    setIsSubmitting(true)

    try {
      const submissionData: any = {}

      // Handle text submission
      if (submissionText) {
        submissionData.text = submissionText
      }

      // Handle file submission
      if (submissionFile) {
        try {
          const uploadResult = await uploadBlueprintSubmission(submissionFile, task.id, enrollmentId)

          submissionData.file = {
            name: submissionFile.name,
            size: submissionFile.size,
            type: submissionFile.type,
            url: uploadResult.url,
          }
        } catch (uploadError: any) {
          console.error("Error uploading file:", uploadError)
          toast.error(`Error uploading file: ${uploadError.message}`)
          setIsSubmitting(false)
          return
        }
      }

      // Complete the task
      await completeTask(
        blueprintId,
        task.id,
        enrollmentId,
        Object.keys(submissionData).length > 0 ? submissionData : undefined,
      )

      toast.success("Task completed successfully!")
      setShowSubmissionForm(false)
      setSubmissionText("")
      setSubmissionFile(null)

      // Notify parent component
      if (onTaskCompleted) {
        onTaskCompleted()
      }
    } catch (error: any) {
      console.error("Error completing task:", error)
      toast.error(`Error completing task: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds the 10MB limit")
        return
      }

      setSubmissionFile(file)
    }
  }

  return (
    <Card
      className={`
      ${isCurrentDay ? "border-primary" : ""}
      ${isCompleted ? "bg-primary/5" : ""}
    `}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              Day {task.day_number}: {task.title}
              {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
            </CardTitle>
            <CardDescription>{task.skill_focus}</CardDescription>
          </div>
          <div>
            {isCurrentDay && (
              <Badge variant="default" className="bg-primary text-white">
                Today
              </Badge>
            )}
            {!isUnlocked && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Lock className="h-3 w-3" /> Locked
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: task.instructions }} />
        </div>

        {task.resources && task.resources.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Resources:</h4>
            <ul className="space-y-1">
              {task.resources.map((resource, index) => (
                <li key={index} className="text-sm">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {resource.title} <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isUnlocked && showSubmissionForm && (
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="submission" className="block text-sm font-medium mb-1">
                Your Submission
              </label>
              <Textarea
                id="submission"
                placeholder="Enter your submission here..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium mb-1">
                Attach File (optional)
              </label>
              <div className="flex items-center gap-2">
                <Input id="file" type="file" onChange={handleFileChange} className="flex-1" />
              </div>
              {submissionFile && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Selected file: {submissionFile.name} ({(submissionFile.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>
          </div>
        )}

        {isCompleted && task.progress?.submission_data && (
          <div className="mt-4 p-3 bg-primary/10 rounded-md">
            <h4 className="text-sm font-medium mb-2">Your Submission:</h4>
            {task.progress.submission_data.text && (
              <p className="text-sm whitespace-pre-wrap">{task.progress.submission_data.text}</p>
            )}
            {task.progress.submission_data.file && (
              <div className="mt-2">
                <a
                  href={task.progress.submission_data.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                >
                  {task.progress.submission_data.file.name} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isUnlocked && !isCompleted && !showSubmissionForm && (
          <Button onClick={() => setShowSubmissionForm(true)} className="w-full">
            Submit Task
          </Button>
        )}

        {isUnlocked && !isCompleted && showSubmissionForm && (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => setShowSubmissionForm(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" /> Complete Task
                </>
              )}
            </Button>
          </div>
        )}

        {isUnlocked && isCompleted && (
          <Button variant="outline" onClick={() => setShowSubmissionForm(!showSubmissionForm)} className="w-full">
            {showSubmissionForm ? "Hide Form" : "Update Submission"}
          </Button>
        )}

        {!isUnlocked && (
          <Button disabled className="w-full opacity-50">
            <Lock className="mr-2 h-4 w-4" /> Locked
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

// Add missing Input component
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  )
}
