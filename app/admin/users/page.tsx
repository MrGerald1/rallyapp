"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Search, User } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("Fetching enrollments...")
        const response = await fetch("/api/enrollments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add cache busting
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        if (response.status === 401) {
          console.warn("Authentication required for enrollments API")
          setError("You need to be logged in to view users. Please log in and try again.")
          setUsers([])
          return
        }

        if (!response.ok) {
          console.error("Error response status:", response.status)
          const errorText = await response.text()
          console.error("Error response text:", errorText)

          let errorData
          try {
            errorData = JSON.parse(errorText)
          } catch (e) {
            errorData = { error: `Failed to fetch users: ${response.status}` }
          }

          throw new Error(errorData.error || `Failed to fetch users: ${response.status}`)
        }

        const data = await response.json()
        console.log("Fetched enrollments:", data)

        if (!data || !data.enrollments) {
          console.warn("No enrollments data returned:", data)
          setUsers([])
        } else {
          setUsers(data.enrollments || [])
        }
      } catch (error: any) {
        console.error("Error fetching users:", error)
        setError(error.message || "Failed to fetch users")
        toast.error("Failed to load users: " + (error.message || "Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) => user.user_email && user.user_email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users by email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">
                  {searchTerm ? "No users found matching your search" : "No users found"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{user.user_email}</h3>
                        <p className="text-sm text-muted-foreground">
                          Enrolled: {new Date(user.start_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link href={`/admin/users/${user.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
