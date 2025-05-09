import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BlueprintForm } from "@/components/blueprint/blueprint-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewBlueprintPage() {
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
          <CardTitle>Create New Blueprint</CardTitle>
        </CardHeader>
        <CardContent>
          <BlueprintForm />
        </CardContent>
      </Card>
    </div>
  )
}
