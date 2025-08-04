"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { getAllEnrollments } from "@/lib/api/blueprint-api"
import { Search, Eye, Download } from "lucide-react"
import Link from "next/link"

interface EnrollmentListProps {
  blueprintId?: string
}

export function EnrollmentList({ blueprintId }: EnrollmentListProps) {
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [filteredEnrollments, setFilteredEnrollments] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchEnrollments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const { enrollments: data } = await getAllEnrollments()

      // Filter by blueprint ID if provided
      const filtered = blueprintId ? data.filter((e) => e.blueprint_id === blueprintId) : data

      setEnrollments(filtered)
      setFilteredEnrollments(filtered)
    } catch (err: any) {
      console.error("Error fetching enrollments:", err)
      setError(err.message || "Failed to load enrollments")
      toast({
        title: "Error",
        description: "Failed to load enrollments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    if (!term.trim()) {
      setFilteredEnrollments(enrollments)
      return
    }

    const filtered = enrollments.filter(
      (enrollment) =>
        enrollment.profiles?.full_name?.toLowerCase().includes(term) ||
        enrollment.profiles?.email?.toLowerCase().includes(term) ||
        enrollment.blueprints?.title?.toLowerCase().includes(term),
    )

    setFilteredEnrollments(filtered)
  }

  const exportToCSV = () => {
    if (filteredEnrollments.length === 0) return

    const headers = ["Name", "Email", "Blueprint", "Status", "Enrolled Date", "Completed Date", "Points"]

    const rows = filteredEnrollments.map((enrollment) => [
      enrollment.profiles?.full_name || "N/A",
      enrollment.profiles?.email || "N/A",
      enrollment.blueprints?.title || "N/A",
      enrollment.status,
      new Date(enrollment.enrolled_at).toLocaleDateString(),
      enrollment.completed_at ? new Date(enrollment.completed_at).toLocaleDateString() : "N/A",
      enrollment.total_points || 0,
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "enrollments.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    fetchEnrollments()
  }, [blueprintId])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrollments</CardTitle>
        <CardDescription>
          {blueprintId ? "Manage users enrolled in this blueprint" : "Manage all blueprint enrollments"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button variant="outline" onClick={exportToCSV} disabled={filteredEnrollments.length === 0}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>

        {filteredEnrollments.length === 0 ? (
          <Alert>
            <AlertTitle>No Enrollments</AlertTitle>
            <AlertDescription>No enrollments found matching your criteria.</AlertDescription>
          </Alert>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Blueprint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{enrollment.profiles?.full_name || "N/A"}</div>
                        <div className="text-sm text-muted-foreground">{enrollment.profiles?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{enrollment.blueprints?.title || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          enrollment.status === "completed"
                            ? "success"
                            : enrollment.status === "active"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {enrollment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(enrollment.enrolled_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {enrollment.total_points ? `${enrollment.total_points} points` : "No progress"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/enrollments/${enrollment.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
