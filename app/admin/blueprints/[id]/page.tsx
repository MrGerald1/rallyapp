"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BlueprintForm } from "@/components/blueprint/blueprint-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Blueprint } from "@/lib/models/blueprint"
import Link from "next/link"

export default function EditBlueprintPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlueprint = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // If we're creating a new blueprint, don't try to fetch
        if (params.id === "new") {
          setBlueprint({
            id: "",
            title: "",
            description: "",
            duration_days: 26,
            start_date: new Date().toISOString(),
            whatsapp_link: "",
            created_at: "",
            updated_at: "",
            is_active: false,
          })
          setIsLoading(false)
          return
        }

        console.log(`Fetching blueprint with ID: ${params.id}`)
        const response = await fetch(`/api/blueprints/${params.id}`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("Error response:", errorData)
          throw new Error(errorData.error || `Failed to fetch blueprint: ${response.status}`)
        }

        const data = await response.json()
        console.log("Fetched blueprint:", data)
        setBlueprint(data)
      } catch (error: any) {
        console.error("Error fetching blueprint:", error)
        setError(error.message || "Failed to load blueprint")
        toast.error("Failed to load blueprint")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlueprint()
  }, [params.id])

  if (isLoading) {
    return (
      <div>
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/admin/blueprints">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blueprints
          </Link>
        </Button>

        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !blueprint) {
    return (
      <div>
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/admin/blueprints">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blueprints
          </Link>
        </Button>

        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500">{error || "Blueprint not found"}</p>
          <Button className="mt-4" onClick={() => router.push("/admin/blueprints")}>
            Back to Blueprints
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/admin/blueprints">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blueprints
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{params.id === "new" ? "Create Blueprint" : "Edit Blueprint"}</CardTitle>
        </CardHeader>
        <CardContent>
          <BlueprintForm blueprint={blueprint} isEdit />
        </CardContent>
      </Card>
    </div>
  )
}
