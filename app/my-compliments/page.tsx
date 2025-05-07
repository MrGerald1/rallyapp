"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ArrowLeft, Users, Calendar } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function MyComplimentsPage() {
  const [activeTab, setActiveTab] = useState("received")
  const [loading, setLoading] = useState(true)
  const [receivedCompliments, setReceivedCompliments] = useState([])
  const [givenCompliments, setGivenCompliments] = useState([])
  const router = useRouter()

  useEffect(() => {
    // Simulate loading data from API
    const fetchCompliments = async () => {
      try {
        setLoading(true)
        // In a real implementation, we would fetch compliments from the API
        // const response = await fetch("/api/compliments?to=" + userEmail)
        // const data = await response.json()
        // setCompliments(data)

        // For now, just simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setReceivedCompliments([])
        setGivenCompliments([])
      } catch (error) {
        console.error("Error fetching compliments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompliments()
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
          <h1 className="text-3xl font-bold">My Compliments</h1>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {receivedCompliments.length} received • {givenCompliments.length} given
          </div>
        </div>

        <Tabs defaultValue="received" className="mb-8" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="given">Given</TabsTrigger>
            <TabsTrigger value="by-challenge">By Challenge</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="mt-8 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : receivedCompliments.length === 0 && givenCompliments.length === 0 ? (
            <EmptyComplimentsState activeTab={activeTab} />
          ) : (
            <>
              <TabsContent value="received" className="mt-6">
                <div className="space-y-4">
                  {receivedCompliments.length === 0 ? (
                    <p className="text-center py-6 text-muted-foreground">
                      You haven't received any compliments yet. Complete challenges to get compliments from others!
                    </p>
                  ) : (
                    receivedCompliments.map((compliment: any) => (
                      <ComplimentCard key={compliment.id} compliment={compliment} type="received" />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="given" className="mt-6">
                <div className="space-y-4">
                  {givenCompliments.length === 0 ? (
                    <p className="text-center py-6 text-muted-foreground">
                      You haven't given any compliments yet. Compliment others to see them here!
                    </p>
                  ) : (
                    givenCompliments.map((compliment: any) => (
                      <ComplimentCard key={compliment.id} compliment={compliment} type="given" />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="by-challenge" className="mt-6">
                <div className="space-y-8">
                  <p className="text-center py-6 text-muted-foreground">
                    Compliments will be grouped by challenge here once you have some!
                  </p>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  )
}

function ComplimentCard({ compliment, type }: { compliment: any; type: "received" | "given" }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback className="bg-primary/10 text-primary">
              {type === "received"
                ? compliment.from_name?.charAt(0).toUpperCase()
                : compliment.to_name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {type === "received" ? `From ${compliment.from_name}` : `To ${compliment.to_name}`}
              </p>
              <span className="text-xs text-muted-foreground">
                {new Date(compliment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm mt-1">{compliment.message}</p>
            <div className="mt-2 text-xs text-muted-foreground">
              <span className="bg-primary/10 px-2 py-1 rounded-full">{compliment.challenge_title || "Challenge"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyComplimentsState({ activeTab }: { activeTab: string }) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Heart className="h-10 w-10 text-primary" />
      </div>

      <h2 className="mb-3 text-2xl font-bold">No compliments yet</h2>
      <p className="mb-6 max-w-md text-muted-foreground">
        {activeTab === "received"
          ? "Compliments are encouraging messages from other Rally users when you complete challenges."
          : activeTab === "given"
            ? "You haven't sent any compliments to other Rally users yet."
            : "Complete challenges and interact with the community to see compliments here."}
      </p>

      <Card className="mb-8 max-w-lg border border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">How compliments work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">1</div>
            <div className="flex-1">
              <p className="font-medium">Complete daily challenges</p>
              <p className="text-sm text-muted-foreground">Complete a daily challenge</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">2</div>
            <div className="flex-1">
              <p className="font-medium">Send compliments to others</p>
              <p className="text-sm text-muted-foreground">
                After completing a challenge, you'll see other entries to compliment
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">3</div>
            <div className="flex-1">
              <p className="font-medium">Receive compliments in return</p>
              <p className="text-sm text-muted-foreground">
                As you participate, others will send you encouraging messages
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
        <Button asChild className="flex items-center">
          <Link href="/">
            <Calendar className="mr-2 h-4 w-4" />
            Try Today's Challenge
          </Link>
        </Button>

        <Button variant="outline" asChild className="flex items-center">
          <Link href="https://chat.whatsapp.com/HsIgtz1Ge0MFryTkAVjnIy" target="_blank" rel="noopener noreferrer">
            <Users className="mr-2 h-4 w-4" />
            Join Community
          </Link>
        </Button>
      </div>
    </div>
  )
}
