"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ChallengeForm } from "./components/challenge-form"
import { Calendar, Edit, Trash, Check, ArrowDownAZ, ArrowUpAZ, CalendarDays, Filter, Loader2 } from "lucide-react"
import { useChallengeStore } from "@/lib/store"
import type { Challenge } from "@/lib/store"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type SortOption = "date-asc" | "date-desc" | "title-asc" | "title-desc" | "category"

export default function AdminPage() {
  const { challenges, currentChallenge, fetchChallenges, fetchCurrentChallenge, isLoading, error } = useChallengeStore()

  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("date-asc")
  const [actionLoading, setActionLoading] = useState(false)
  const [processingChallengeId, setProcessingChallengeId] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)

  useEffect(() => {
    // Check if already authenticated in this session
    const auth = sessionStorage.getItem("rally-admin-auth")
    if (auth === "true") {
      setIsAuthenticated(true)
      fetchChallenges()
      fetchCurrentChallenge()
      setLastRefreshed(new Date())
    }

    // Add event listener for refreshing challenges
    const handleRefreshChallenges = () => {
      fetchChallenges()
      fetchCurrentChallenge()
      setLastRefreshed(new Date())
    }

    window.addEventListener("refreshChallenges", handleRefreshChallenges)

    // Clean up event listener
    return () => {
      window.removeEventListener("refreshChallenges", handleRefreshChallenges)
    }
  }, [fetchChallenges, fetchCurrentChallenge])

  // Sort challenges based on the selected sort option
  const sortedChallenges = [...challenges].sort((a, b) => {
    switch (sortOption) {
      case "date-asc":
        return new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
      case "date-desc":
        return new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime()
      case "title-asc":
        return a.title.localeCompare(b.title)
      case "title-desc":
        return b.title.localeCompare(a.title)
      case "category":
        return a.category.localeCompare(b.category)
      default:
        return 0
    }
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "admin456") {
      setIsAuthenticated(true)
      sessionStorage.setItem("rally-admin-auth", "true")
      fetchChallenges()
      fetchCurrentChallenge()
      setLastRefreshed(new Date())
    } else {
      setLoginError("Invalid password")
    }
  }

  const handleSetCurrent = async (challenge: Challenge) => {
    try {
      setActionLoading(true)
      setProcessingChallengeId(challenge.id)

      // Show a toast to indicate the action is in progress
      toast.loading("Setting as current challenge...", { id: "set-current" })

      console.log(`Setting challenge ${challenge.id} as current...`)

      // Make the API call with explicit no-cache headers
      const response = await fetch("/api/challenges/current", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        body: JSON.stringify({ id: challenge.id }),
      })

      console.log(`API response status: ${response.status}`)

      // Log the full response for debugging
      const responseData = await response.json()
      console.log("API response data:", responseData)

      if (!response.ok) {
        throw new Error(responseData.error || `Failed to set current challenge: ${response.status}`)
      }

      // Dismiss the loading toast and show success
      toast.dismiss("set-current")
      toast.success("Current challenge updated successfully")

      // Force a complete refresh of the data
      await fetchChallenges()
      await fetchCurrentChallenge()
      setLastRefreshed(new Date())

      console.log("Data refreshed after setting current challenge")
    } catch (error) {
      console.error("Error setting current challenge:", error)

      // Dismiss the loading toast and show error
      toast.dismiss("set-current")
      toast.error(`Error: ${error instanceof Error ? error.message : "Failed to set current challenge"}`)
    } finally {
      setActionLoading(false)
      setProcessingChallengeId(null)
    }
  }

  const handleDeleteChallenge = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this challenge?")) {
      try {
        setActionLoading(true)
        setProcessingChallengeId(id)

        // Show a toast to indicate the action is in progress
        toast.loading("Deleting challenge...", { id: "delete-challenge" })

        const response = await fetch(`/api/challenges/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to delete challenge: ${response.status}`)
        }

        // Dismiss the loading toast and show success
        toast.dismiss("delete-challenge")
        toast.success("Challenge deleted successfully")

        // Refresh challenges
        await fetchChallenges()
        await fetchCurrentChallenge()
        setLastRefreshed(new Date())
      } catch (error) {
        console.error("Error deleting challenge:", error)

        // Dismiss the loading toast and show error
        toast.dismiss("delete-challenge")
        toast.error(`Error: ${error instanceof Error ? error.message : "Failed to delete challenge"}`)
      } finally {
        setActionLoading(false)
        setProcessingChallengeId(null)
      }
    }
  }

  const handleManualRefresh = async () => {
    try {
      toast.loading("Refreshing data...", { id: "refresh-data" })
      await fetchChallenges()
      await fetchCurrentChallenge()
      setLastRefreshed(new Date())
      toast.dismiss("refresh-data")
      toast.success("Data refreshed successfully")
    } catch (error) {
      toast.dismiss("refresh-data")
      toast.error(`Error refreshing data: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto flex max-w-md flex-col items-center justify-center px-4 py-8">
          <Card className="w-full p-6">
            <h1 className="mb-4 text-2xl font-bold">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{loginError}</div>}
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                Login
              </Button>
            </form>
          </Card>
        </main>
      </div>
    )
  }

  if (isLoading && challenges.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto max-w-4xl px-4 py-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-10">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Loading challenges...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error && challenges.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto max-w-4xl px-4 py-6">
          <div className="text-center">
            <p className="text-red-500">Error: {error}</p>
            <Button onClick={() => fetchChallenges()} className="mt-4">
              Try Again
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">Manage Challenges</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Create and manage daily challenges for users
              {lastRefreshed && (
                <span className="ml-2 text-xs">Last refreshed: {lastRefreshed.toLocaleTimeString()}</span>
              )}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {!isCreating && !editingChallenge && (
              <>
                <Button onClick={() => setIsCreating(true)} className="w-full sm:w-auto">
                  <span className="mr-2">+</span> Add Challenge
                </Button>
                <Button
                  variant="outline"
                  onClick={handleManualRefresh}
                  disabled={actionLoading}
                  className="w-full sm:w-auto"
                >
                  Refresh Data
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={() => {
                sessionStorage.removeItem("rally-admin-auth")
                setIsAuthenticated(false)
              }}
              className="w-full sm:w-auto"
            >
              Logout
            </Button>
          </div>
        </div>

        {(isCreating || editingChallenge) && (
          <Card className="mb-6 p-4 sm:p-5">
            <h2 className="mb-4 text-lg font-bold sm:text-xl">
              {editingChallenge ? "Edit Challenge" : "Create New Challenge"}
            </h2>
            <ChallengeForm
              challenge={editingChallenge || undefined}
              onCancel={() => {
                setIsCreating(false)
                setEditingChallenge(null)
              }}
            />
          </Card>
        )}

        {/* Sort controls */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium">Sort by:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  {sortOption === "date-asc" && "Date (Earliest first)"}
                  {sortOption === "date-desc" && "Date (Latest first)"}
                  {sortOption === "title-asc" && "Title (A-Z)"}
                  {sortOption === "title-desc" && "Title (Z-A)"}
                  {sortOption === "category" && "Category"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setSortOption("date-asc")}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Date (Earliest first)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("date-desc")}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Date (Latest first)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("title-asc")}>
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                  Title (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("title-desc")}>
                  <ArrowUpAZ className="mr-2 h-4 w-4" />
                  Title (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("category")}>
                  <Filter className="mr-2 h-4 w-4" />
                  Category
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="text-sm text-muted-foreground">
            {challenges.length} challenge{challenges.length !== 1 ? "s" : ""} found
            {currentChallenge && (
              <span className="ml-2">
                Current: <span className="font-medium">{currentChallenge.title}</span>
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {sortedChallenges.map((challenge) => (
            <Card
              key={challenge.id}
              className={`p-4 sm:p-5 ${currentChallenge?.id === challenge.id ? "border-2 border-primary" : ""}`}
            >
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                <div className="space-y-3 sm:pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold sm:text-xl">{challenge.title}</h2>
                    <Badge>{challenge.category}</Badge>
                    <Badge variant="outline">{challenge.difficulty}</Badge>
                    {currentChallenge?.id === challenge.id && <Badge variant="secondary">Current Challenge</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground sm:text-base">{challenge.description}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{challenge.scheduled_date}</span>
                    <span className="text-primary">{challenge.hashtag}</span>
                  </div>
                  <blockquote className="border-l-2 border-primary/20 pl-3 text-sm sm:pl-4 sm:text-base">
                    <p className="italic">"{challenge.quote}"</p>
                    <footer className="mt-1 text-xs text-muted-foreground sm:text-sm">— {challenge.author}</footer>
                  </blockquote>
                </div>
                <div className="flex flex-row gap-2 self-start sm:flex-col">
                  {currentChallenge?.id !== challenge.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetCurrent(challenge)}
                      disabled={actionLoading}
                      className="flex-1 sm:flex-none"
                    >
                      {actionLoading && processingChallengeId === challenge.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      <span className="hidden sm:inline">Set as Current</span>
                      <span className="sm:hidden">Set Current</span>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingChallenge(challenge)}
                    className="flex-1 sm:flex-none"
                    disabled={actionLoading}
                  >
                    <Edit className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteChallenge(challenge.id)}
                    className="flex-1 text-destructive hover:text-destructive sm:flex-none"
                    disabled={actionLoading}
                  >
                    {actionLoading && processingChallengeId === challenge.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4 sm:mr-2" />
                    )}
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
