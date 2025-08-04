"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { getBlueprints, deleteBlueprint, setActiveBlueprint } from "@/lib/api/blueprint-api"
import { PlusCircle, Edit, Trash, CheckCircle, Users, FileText } from "lucide-react"
import Link from "next/link"

export function BlueprintAdminPanel() {
  const [blueprints, setBlueprints] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchBlueprints = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getBlueprints()
      setBlueprints(data)
    } catch (err: any) {
      console.error("Error fetching blueprints:", err)
      setError(err.message || "Failed to load blueprints")
      toast({
        title: "Error",
        description: "Failed to load blueprints",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetActive = async (blueprintId: string) => {
    try {
      await setActiveBlueprint(blueprintId)
      toast({
        title: "Success",
        description: "Blueprint set as active",
      })
      fetchBlueprints()
    } catch (err: any) {
      console.error("Error setting active blueprint:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to set active blueprint",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (blueprintId: string) => {
    if (!confirm("Are you sure you want to delete this blueprint? This action cannot be undone.")) {
      return
    }

    try {
      await deleteBlueprint(blueprintId)
      toast({
        title: "Success",
        description: "Blueprint deleted successfully",
      })
      fetchBlueprints()
    } catch (err: any) {
      console.error("Error deleting blueprint:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to delete blueprint",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchBlueprints()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blueprint Management</h2>
        <Link href="/admin/blueprints/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" /> Create Blueprint
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Blueprints</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blueprints.map((blueprint) => (
              <BlueprintCard
                key={blueprint.id}
                blueprint={blueprint}
                onSetActive={handleSetActive}
                onDelete={handleDelete}
              />
            ))}
          </div>
          {blueprints.length === 0 && (
            <Alert>
              <AlertTitle>No Blueprints</AlertTitle>
              <AlertDescription>No blueprints have been created yet.</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blueprints
              .filter((blueprint) => blueprint.is_active)
              .map((blueprint) => (
                <BlueprintCard
                  key={blueprint.id}
                  blueprint={blueprint}
                  onSetActive={handleSetActive}
                  onDelete={handleDelete}
                />
              ))}
          </div>
          {blueprints.filter((blueprint) => blueprint.is_active).length === 0 && (
            <Alert>
              <AlertTitle>No Active Blueprints</AlertTitle>
              <AlertDescription>No active blueprints found.</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blueprints
              .filter((blueprint) => !blueprint.is_active)
              .map((blueprint) => (
                <BlueprintCard
                  key={blueprint.id}
                  blueprint={blueprint}
                  onSetActive={handleSetActive}
                  onDelete={handleDelete}
                />
              ))}
          </div>
          {blueprints.filter((blueprint) => !blueprint.is_active).length === 0 && (
            <Alert>
              <AlertTitle>No Draft Blueprints</AlertTitle>
              <AlertDescription>No draft blueprints found.</AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface BlueprintCardProps {
  blueprint: any
  onSetActive: (id: string) => void
  onDelete: (id: string) => void
}

function BlueprintCard({ blueprint, onSetActive, onDelete }: BlueprintCardProps) {
  return (
    <Card className={blueprint.is_active ? "border-primary" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{blueprint.title}</CardTitle>
            <CardDescription>
              {blueprint.duration_days} days • {blueprint.blueprint_tasks?.length || 0} tasks
            </CardDescription>
          </div>
          {blueprint.is_active && (
            <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" /> Active
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-2">{blueprint.description}</p>

        <div className="flex items-center mt-4 text-sm text-muted-foreground">
          <div className="flex items-center mr-4">
            <FileText className="h-4 w-4 mr-1" />
            {blueprint.blueprint_tasks?.length || 0} tasks
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {blueprint.enrollment_count || 0} enrollments
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Link href={`/admin/blueprints/${blueprint.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => onDelete(blueprint.id)}>
            <Trash className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
        {!blueprint.is_active && (
          <Button size="sm" onClick={() => onSetActive(blueprint.id)}>
            Set Active
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
