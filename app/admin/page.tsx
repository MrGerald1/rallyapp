"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ChallengeForm } from "./components/challenge-form"
import { Calendar, Edit, Trash, Check } from "lucide-react"
import { useChallengeStore } from "@/lib/store"
import type { Challenge } from "@/lib/store"

export default function AdminPage() {
  const {
    challenges,
    currentChallenge,
    setCurrentChallenge,
    deleteChallenge,
    fetchChallenges,
    fetchCurrentChallenge,
    isLoading,
    error,
  } = useChallengeStore()

  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  useEffect(() => {
    // Check if already authenticated in this session
    const auth = sessionStorage.getItem("rally-admin-auth")
    if (auth === "true") {
      setIsAuthenticated(true)
      fetchChallenges()
      fetchCurrentChallenge()
    }
  }, [fetchChallenges, fetchCurrentChallenge])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "admin456") {
      setIsAuthenticated(true)
      sessionStorage.setItem("rally-admin-auth", "true")
      fetchChallenges()
      fetchCurrentChallenge()
    } else {
      setLoginError("Invalid password")
    }
  }

  const handleSetCurrent = (challenge: Challenge) => {
    setCurrentChallenge(challenge)
  }

  const handleDeleteChallenge = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this challenge?")) {
      await deleteChallenge(id)
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
            <p className="text-sm text-muted-foreground sm:text-base">Create and manage daily challenges for users</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {!isCreating && !editingChallenge && (
              <Button onClick={() => setIsCreating(true)} className="w-full sm:w-auto">
                <span className="mr-2">+</span> Add Challenge
              </Button>
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

        <div className="space-y-4">
          {challenges.map((challenge) => (
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
                      disabled={isLoading}
                      className="flex-1 sm:flex-none"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Set as Current</span>
                      <span className="sm:hidden">Set Current</span>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingChallenge(challenge)}
                    className="flex-1 sm:flex-none"
                  >
                    <Edit className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteChallenge(challenge.id)}
                    className="flex-1 text-destructive hover:text-destructive sm:flex-none"
                    disabled={isLoading}
                  >
                    <Trash className="h-4 w-4 sm:mr-2" />
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
