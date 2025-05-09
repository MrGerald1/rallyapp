"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentSubmissions } from "@/components/recent-submissions"
import { WeeklyLeaderboard } from "@/components/weekly-leaderboard"
import { useChallengeStore } from "@/lib/store"
import { InfoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"

interface CommunityTabsProps {
  challengeId?: string
  currentUserEmail?: string
  defaultTab?: string
}

export function CommunityTabs({ challengeId, currentUserEmail, defaultTab = "submissions" }: CommunityTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const { fetchSubmissions, fetchLeaderboard, refreshData, lastRefreshed } = useChallengeStore()
  const [showRankingDialog, setShowRankingDialog] = useState(false)

  // Check if data needs refresh (older than 5 minutes)
  const needsRefresh = Date.now() - lastRefreshed > 5 * 60 * 1000

  useEffect(() => {
    // Load initial data or refresh if needed
    if (needsRefresh) {
      refreshData()
    } else {
      // Load data for the active tab only
      if (activeTab === "submissions") {
        fetchSubmissions()
      } else if (activeTab === "leaderboard") {
        fetchLeaderboard()
      }
    }
  }, [activeTab, fetchSubmissions, fetchLeaderboard, refreshData, needsRefresh])

  return (
    <div className="bg-[#E2F1EB] rounded-lg overflow-hidden border-none">
      <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 bg-transparent border-b-0">
          <TabsTrigger
            value="submissions"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Submissions
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Leaderboard
          </TabsTrigger>
        </TabsList>

        {/* Subtexts for each tab */}
        <div className="px-6 pt-3 pb-1 text-sm text-muted-foreground">
          {activeTab === "submissions" ? (
            <div className="flex items-center justify-between">
              <p>See what others have shared and send compliments to earn points!</p>
              <Button variant="ghost" size="sm" className="p-1 h-auto" asChild>
                <Link href="/complements">View All</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p>Top performers this week based on challenge completions and points.</p>
              <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={() => setShowRankingDialog(true)}>
                <InfoIcon size={16} className="text-muted-foreground" />
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="submissions" className="m-0 border-t-0">
          <RecentSubmissions
            limit={3}
            showViewAll={true}
            hideHeader={true}
            challengeId={challengeId}
            currentUserEmail={currentUserEmail}
          />
        </TabsContent>
        <TabsContent value="leaderboard" className="m-0 border-t-0">
          <WeeklyLeaderboard limit={3} showViewAll={true} hideHeader={true} />
        </TabsContent>
      </Tabs>

      {/* Ranking Info Dialog */}
      <Dialog open={showRankingDialog} onOpenChange={setShowRankingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to Improve Your Ranking</DialogTitle>
          </DialogHeader>
          <DialogDescription>Climb the leaderboard by earning more points through these activities:</DialogDescription>
          <div className="mt-4 space-y-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>Completing a daily challenge: +5 pts</li>
              <li>Starting within 3 hrs of drop: +2 pts</li>
              <li>3-day streak bonus: +3 pts</li>
              <li>7-day streak bonus: +10 pts</li>
              <li>30-day streak bonus: +15 pts</li>
              <li>Giving compliments: +1 pt each (max 3/day)</li>
              <li>Receiving compliments: +2 pts each (max 5/day)</li>
            </ul>
            <p className="mt-4 text-sm">
              The leaderboard resets weekly. Keep your streak going to maintain your position!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
