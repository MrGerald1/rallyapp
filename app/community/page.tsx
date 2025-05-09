"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeeklyLeaderboard } from "@/components/weekly-leaderboard"
import { ComplimentsSection } from "@/components/compliments-section"

export default function CommunityPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("leaderboard")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "compliments" || tab === "leaderboard") {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/community?tab=${value}`, { scroll: false })
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold mb-6">Community</h1>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="compliments">Compliments</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="mt-0">
            <WeeklyLeaderboard limit={10} showViewAll={false} hideHeader={true} />
          </TabsContent>

          <TabsContent value="compliments" className="mt-0">
            <ComplimentsSection />
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  )
}
