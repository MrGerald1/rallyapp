"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const pathname = usePathname()

  useEffect(() => {
    // Check if already authenticated in this session
    const auth = sessionStorage.getItem("rally-admin-auth")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "admin456") {
      setIsAuthenticated(true)
      sessionStorage.setItem("rally-admin-auth", "true")
    } else {
      setLoginError("Invalid password")
    }
  }

  // Get the active tab based on the current path
  const getActiveTab = () => {
    if (pathname.includes("/admin/blueprints")) return "blueprints"
    if (pathname.includes("/admin/users")) return "users"
    return "challenges"
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

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button
            variant="outline"
            onClick={() => {
              sessionStorage.removeItem("rally-admin-auth")
              setIsAuthenticated(false)
            }}
          >
            Logout
          </Button>
        </div>

        <Tabs defaultValue={getActiveTab()} className="mb-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="challenges" asChild>
              <Link href="/admin">Challenges</Link>
            </TabsTrigger>
            <TabsTrigger value="blueprints" asChild>
              <Link href="/admin/blueprints">Blueprints</Link>
            </TabsTrigger>
            <TabsTrigger value="users" asChild>
              <Link href="/admin/users">Enrollees</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {children}
      </div>
    </div>
  )
}
