"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ArrowLeft, Users, Calendar } from "lucide-react"

export default function MyComplementsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)
  const [complements, setComplements] = useState([])
  const router = useRouter()

  useEffect(() => {
    // Simulate loading data from API
    const fetchComplements = async () => {
      try {
        setLoading(true)
        // In a real implementation, we would fetch complements from the API
        // const response = await fetch("/api/complements?to=" + userEmail)
        // const data = await response.json()
        // setComplements(data)

        // For now, just simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setComplements([])
      } catch (error) {
        console.error("Error fetching complements:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchComplements()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to challenges
        </Button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Complements</h1>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {complements.length} received
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="by-challenge">By Challenge</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="mt-8 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : complements.length === 0 ? (
            <EmptyComplementsState />
          ) : (
            <>
              <TabsContent value="all" className="mt-6">
                <div className="space-y-4">{/* Complement cards would go here */}</div>
              </TabsContent>

              <TabsContent value="recent" className="mt-6">
                <div className="space-y-4">{/* Recent complement cards would go here */}</div>
              </TabsContent>

              <TabsContent value="by-challenge" className="mt-6">
                <div className="space-y-8">{/* Complements grouped by challenge would go here */}</div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  )
}

function EmptyComplementsState() {
  const router = useRouter()

  return (
    <div className="mt-8 flex flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Heart className="h-10 w-10 text-primary" />
      </div>

      <h2 className="mb-3 text-2xl font-bold">No complements yet</h2>
      <p className="mb-6 max-w-md text-muted-foreground">
        Complements are encouraging messages from other Rally users when you complete challenges.
      </p>

      <Card className="mb-8 max-w-lg border border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">How to get complements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">1</div>
            <div className="flex-1">
              <p className="font-medium">Complete daily challenges</p>
              <p className="text-sm text-muted-foreground">Submit your response to the daily challenge</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">2</div>
            <div className="flex-1">
              <p className="font-medium">Rally together with others</p>
              <p className="text-sm text-muted-foreground">
                After completing a challenge, you'll see other submissions to complement
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">3</div>
            <div className="flex-1">
              <p className="font-medium">Receive complements in return</p>
              <p className="text-sm text-muted-foreground">
                As you participate, others will send you encouraging messages
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
        <Button onClick={() => router.push("/")} className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          Try Today's Challenge
        </Button>

        <Button variant="outline" onClick={() => router.push("/")} className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          View Community
        </Button>
      </div>
    </div>
  )
}
