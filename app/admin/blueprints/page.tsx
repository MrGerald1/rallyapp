"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { Blueprint } from "@/lib/models/blueprint"
import { Loader2, Plus, Edit, Trash, Users, Calendar, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminBlueprintsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [blueprints, setBlueprints] = useState<Blueprint[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [processingBlueprintId, setProcessingBlueprintId] = useState<string | null>(null)

  const fetchBlueprints = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("Fetching blueprints...")

      const response = await fetch("/api/blueprints")

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error response:", errorData)
        throw new Error(errorData.error || `Failed to fetch blueprints: ${response.status}`)
      }

      const data = await response.json()
      console.log("Fetched blueprints:", data)
      setBlueprints(data)
    } catch (error: any) {
      console.error("Error fetching blueprints:", error)
      setError(error.message || "Failed to load blueprints")
      toast.error("Failed to load blueprints")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBlueprints()
  }, [fetchBlueprints])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blueprint?")) {
      return
    }

    try {
      const response = await fetch(`/api/blueprints/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete blueprint")
      }

      setBlueprints((prev) => prev.filter((blueprint) => blueprint.id !== id))
      toast.success("Blueprint deleted successfully")
    } catch (error: any) {
      console.error("Error deleting blueprint:", error)
      toast.error("Failed to delete blueprint")
    }
  }

  const setActiveBlueprint = async (id: string) => {
    try {
      setActionLoading(true)
      setProcessingBlueprintId(id)

      const response = await fetch(`/api/blueprints/${id}/set-active`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to set active blueprint")
      }

      toast.success("Blueprint set as active successfully")
      fetchBlueprints()
    } catch (error: any) {
      console.error("Error setting active blueprint:", error)
      toast.error(error.message || "Failed to set active blueprint")
    } finally {
      setActionLoading(false)
      setProcessingBlueprintId(null)
    }
  }

  const filteredBlueprints = blueprints.filter((blueprint) =>
    blueprint.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Blueprints</h1>
          <p className="text-muted-foreground">Create and manage your blueprint programs</p>
        </div>
        <Button className="mt-4 sm:mt-0" onClick={() => router.push("/admin/blueprints/new")}>
          <Plus className="mr-2 h-4 w-4" /> Create Blueprint
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search blueprints..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500">{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredBlueprints.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? "No blueprints match your search" : "No blueprints found"}
            </p>
            {!searchTerm && (
              <Button className="mt-4" onClick={() => router.push("/admin/blueprints/new")}>
                <Plus className="mr-2 h-4 w-4" /> Create Your First Blueprint
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredBlueprints.map((blueprint) => (
            <Card key={blueprint.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{blueprint.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{blueprint.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-primary" />
                      <span>{new Date(blueprint.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4 text-primary" />
                      <span>{blueprint.duration_days} days</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`/admin/blueprints/${blueprint.id}/tasks`}>Manage Tasks</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/blueprints/${blueprint.id}`)}
                      className="flex-1"
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(blueprint.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    {!blueprint.is_active && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveBlueprint(blueprint.id)}
                        disabled={actionLoading && processingBlueprintId === blueprint.id}
                      >
                        {actionLoading && processingBlueprintId === blueprint.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        Set Active
                      </Button>
                    )}
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
