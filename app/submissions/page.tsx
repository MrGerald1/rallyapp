import { SiteHeader } from "@/components/site-header"
import { RecentSubmissions } from "@/components/recent-submissions"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SubmissionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto max-w-3xl px-4 py-6 sm:py-8">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">All Submissions</h1>
        </div>

        <RecentSubmissions limit={20} showViewAll={false} />
      </main>
    </div>
  )
}
