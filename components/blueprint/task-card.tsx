"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { BlueprintTask } from "@/lib/models/blueprint"
import { CheckCircle, ExternalLink, ChevronDown, ChevronUp, Edit, Upload, FileText, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { TiptapEditor } from "@/lib/tiptap-editor"
import { toast } from "sonner"

interface BlueprintTaskCardProps {
  task: BlueprintTask & { progress?: any }
  onComplete: (taskId: string, submissionData: any) => void
  userEmail: string
}

export function BlueprintTaskCard({ task, onComplete, userEmail }: BlueprintTaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [reflection, setReflection] = useState("")
  const [submission, setSubmission] = useState(task.progress?.submission_data?.submission || "")

  const [submissionType, setSubmissionType] = useState<"text" | "file">("text")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFileUrl, setUploadedFileUrl] = useState("")
  const [uploadedFileName, setUploadedFileName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const isCompleted = task.progress?.completed
  const completionDate = task.progress?.completion_date
    ? new Date(task.progress.completion_date).toLocaleDateString()
    : null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds the 10MB limit")
        return
      }
      setUploadedFile(file)
      setUploadedFileName(file.name)
    }
  }

  // Add this function to handle file upload:
  const handleFileUpload = async () => {
    if (!uploadedFile) {
      toast.error("Please select a file to upload")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)
      formData.append("email", userEmail)
      formData.append("taskId", task.id)

      const response = await fetch("/api/upload/blueprint-submission", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload file")
      }

      const data = await response.json()
      setUploadedFileUrl(data.fileUrl)
      toast.success("File uploaded successfully")
    } catch (error: any) {
      console.error("Error uploading file:", error)
      toast.error(error.message || "Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      let submissionData = {}

      if (task.requires_submission) {
        if (submissionType === "text") {
          submissionData = { submission, type: "text" }
        } else {
          if (!uploadedFileUrl) {
            toast.error("Please upload a file first")
            setIsSubmitting(false)
            return
          }
          submissionData = {
            fileUrl: uploadedFileUrl,
            fileName: uploadedFileName,
            type: "file",
          }
        }
      } else {
        submissionData = { reflection }
      }

      await onComplete(task.id, submissionData)
      setShowCompleteDialog(false)
      setReflection("")
    } catch (error) {
      console.error("Error completing task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmission = async () => {
    setIsSubmitting(true)
    try {
      await onComplete(task.id, { submission })
      setShowEditDialog(false)
    } catch (error) {
      console.error("Error updating submission:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to safely render HTML content
  const renderHTML = (content: string) => {
    return { __html: content || "" }
  }

  return (
    <Card className={isCompleted ? "border-green-200 bg-green-50/30" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">Day {task.day_number}</Badge>
            {isCompleted && (
              <Badge className="bg-green-500">
                <CheckCircle className="mr-1 h-3 w-3" /> Completed
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span className="sr-only">{isExpanded ? "Show less" : "Show more"}</span>
          </Button>
        </div>
        <CardTitle className="text-xl">{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={renderHTML(task.instructions)} />
          </div>

          {isExpanded && (
            <>
              <div className="rounded-lg bg-primary/5 p-4">
                <h3 className="font-semibold">Skill Focus</h3>
                <p className="text-sm mt-1">{task.skill_focus}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Context & Examples</h3>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={renderHTML(task.examples)} />
              </div>

              <div className="rounded-lg bg-yellow-50 p-4">
                <h3 className="font-semibold mb-1">Inspirational Story</h3>
                <div className="prose prose-sm max-w-none italic" dangerouslySetInnerHTML={renderHTML(task.story)} />
              </div>

              {task.resources && task.resources.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Resources</h3>
                  <ul className="space-y-2">
                    {task.resources.map((resource, index) => (
                      <li key={index}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:underline"
                        >
                          <ExternalLink className="mr-1 h-4 w-4" />
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {isCompleted && task.progress?.submission_data?.reflection && (
            <div className="rounded-lg bg-green-50 p-4 mt-4">
              <h3 className="font-semibold mb-1">Your Reflection</h3>
              <p className="text-sm">{task.progress.submission_data.reflection}</p>
              <p className="text-xs text-muted-foreground mt-2">Completed on {completionDate}</p>
            </div>
          )}

          {isCompleted && task.progress?.submission_data && (
            <div className="rounded-lg bg-green-50 p-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold mb-1">Your Submission</h3>
                {task.progress.submission_data.type !== "file" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSubmission(task.progress.submission_data.submission)
                      setShowEditDialog(true)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                )}
              </div>

              {task.progress.submission_data.type === "file" ? (
                <div className="flex items-center mt-2">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  <a
                    href={task.progress.submission_data.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {task.progress.submission_data.fileName || "View uploaded file"}
                  </a>
                </div>
              ) : (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={renderHTML(task.progress.submission_data.submission)}
                />
              )}

              <p className="text-xs text-muted-foreground mt-2">Completed on {completionDate}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {!isCompleted ? (
          <Button
            className="w-full"
            onClick={() => {
              if (task.requires_submission) {
                setShowCompleteDialog(true)
              } else {
                setShowCompleteDialog(true)
              }
            }}
          >
            {task.requires_submission ? "Submit Task" : "Mark as Complete"}
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            <CheckCircle className="mr-2 h-4 w-4" /> Completed
          </Button>
        )}
      </CardFooter>

      {/* Complete Task Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {task.requires_submission ? "Submit Task" : "Complete Task"}: {task.title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {task.requires_submission ? (
              <>
                {task.submission_instructions && (
                  <div
                    className="mb-4 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={renderHTML(task.submission_instructions)}
                  />
                )}

                <Tabs
                  defaultValue="text"
                  value={submissionType}
                  onValueChange={(v) => setSubmissionType(v as "text" | "file")}
                  className="mb-4"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Text Submission</TabsTrigger>
                    <TabsTrigger value="file">File Upload</TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="mt-4">
                    <TiptapEditor
                      content={submission}
                      onChange={setSubmission}
                      placeholder="Enter your submission here..."
                    />
                  </TabsContent>

                  <TabsContent value="file" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Select File
                        </Button>
                      </div>

                      {uploadedFileName && (
                        <div className="flex items-center gap-2 p-2 border rounded">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span className="text-sm truncate flex-1">{uploadedFileName}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setUploadedFile(null)
                              setUploadedFileName("")
                              setUploadedFileUrl("")
                            }}
                            className="h-8 w-8 p-0"
                          >
                            &times;
                          </Button>
                        </div>
                      )}

                      {uploadedFile && !uploadedFileUrl && (
                        <Button type="button" onClick={handleFileUpload} disabled={isUploading} className="w-full">
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload File
                            </>
                          )}
                        </Button>
                      )}

                      {uploadedFileUrl && (
                        <div className="p-2 bg-green-50 border border-green-200 rounded">
                          <p className="text-sm text-green-700 flex items-center">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            File uploaded successfully
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <>
                <p className="mb-4">
                  Congratulations on completing this task! Please share a brief reflection on what you learned or
                  accomplished.
                </p>
                <textarea
                  id="reflection"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="I completed this task by..."
                  className="w-full p-3 border rounded-md min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleComplete}
              disabled={
                isSubmitting ||
                (task.requires_submission
                  ? submissionType === "text"
                    ? !submission.trim()
                    : !uploadedFileUrl
                  : !reflection.trim())
              }
            >
              {isSubmitting ? "Submitting..." : task.requires_submission ? "Submit" : "Submit & Complete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Submission Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Submission: {task.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <TiptapEditor content={submission} onChange={setSubmission} placeholder="Edit your submission..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmission} disabled={isSubmitting || !submission.trim()}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
