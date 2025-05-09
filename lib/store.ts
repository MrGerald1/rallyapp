import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Challenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  hashtag: string
  quote: string
  author: string
  scheduled_date: string
  is_current?: boolean
}

interface Submission {
  id: string
  name: string
  handle: string
  submission_link: string
  challenge_id: string
  created_at: string
  email: string
}

interface LeaderboardEntry {
  email: string
  name: string
  points: number
  currentStreak: number
  position: number
}

interface StreakData {
  currentStreak: number
  longestStreak: number
  submissionCount: number
  points: number
  lastSubmissionDate: string
}

interface ChallengeState {
  challenges: Challenge[]
  currentChallenge: Challenge | null
  submissions: Submission[]
  leaderboard: LeaderboardEntry[]
  streakData: StreakData | null
  isLoading: boolean
  error: string | null
  submissionsLoaded: boolean
  leaderboardLoaded: boolean
  streakLoaded: boolean
  lastRefreshed: number
  submissionsLastRefreshed: number
  leaderboardLastRefreshed: number

  // Actions
  fetchChallenges: () => Promise<void>
  fetchCurrentChallenge: () => Promise<Challenge | null>
  fetchSubmissions: () => Promise<Submission[]>
  fetchLeaderboard: () => Promise<LeaderboardEntry[]>
  fetchUserStreak: (email: string) => Promise<StreakData | null>
  refreshData: () => Promise<void>
  addSubmission: (challengeId: string, submissionData: any) => Promise<Submission | null>
  sendCompliment: (
    fromEmail: string,
    toEmail: string,
    challengeId: string,
    message: string,
    submissionId?: number,
  ) => Promise<any>
  setReminder: (email: string) => Promise<void>
  hasSubmittedToday: boolean
  setHasSubmittedToday: (value: boolean) => void
}

// Helper to check if data needs refresh (older than 5 minutes)
const needsRefresh = (lastRefreshed: number) => {
  return Date.now() - lastRefreshed > 5 * 60 * 1000 // 5 minutes
}

export const useChallengeStore = create<ChallengeState>()(
  persist(
    (set, get) => ({
      challenges: [],
      currentChallenge: null,
      submissions: [],
      leaderboard: [],
      streakData: null,
      isLoading: false,
      error: null,
      submissionsLoaded: false,
      leaderboardLoaded: false,
      streakLoaded: false,
      lastRefreshed: 0,
      submissionsLastRefreshed: 0,
      leaderboardLastRefreshed: 0,
      hasSubmittedToday: false,

      setHasSubmittedToday: (value: boolean) => set({ hasSubmittedToday: value }),

      fetchChallenges: async () => {
        set({ isLoading: true, error: null })
        try {
          // Add cache-busting parameter and headers
          const timestamp = new Date().getTime()
          const response = await fetch(`/api/challenges?_=${timestamp}`, {
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `Failed to fetch challenges: ${response.status}`)
          }

          const data = await response.json()
          set({ challenges: data, isLoading: false })
          return data
        } catch (error: any) {
          console.error("Error fetching challenges:", error)
          set({ error: error.message, isLoading: false })
          return []
        }
      },

      fetchCurrentChallenge: async () => {
        set({ isLoading: true, error: null })
        try {
          // Always add a cache-busting parameter to prevent browser caching
          const timestamp = new Date().getTime()
          const response = await fetch(`/api/challenges/current?_=${timestamp}`, {
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `Failed to fetch current challenge: ${response.status}`)
          }

          const data = await response.json()

          // Log the current challenge for debugging
          console.log("Current challenge fetched:", data)

          set({
            currentChallenge: data,
            isLoading: false,
            lastRefreshed: Date.now(),
          })

          return data
        } catch (error) {
          console.error("Error fetching current challenge:", error)
          set({
            error: error instanceof Error ? error.message : "Unknown error",
            isLoading: false,
          })
          return null
        }
      },

      fetchSubmissions: async () => {
        try {
          // Add cache-busting parameter and headers
          const timestamp = new Date().getTime()
          const response = await fetch(`/api/submissions?_=${timestamp}`, {
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `Failed to fetch submissions: ${response.status}`)
          }

          const data = await response.json()
          set({
            submissions: data,
            submissionsLoaded: true,
            submissionsLastRefreshed: Date.now(),
          })
          return data
        } catch (error: any) {
          console.error("Error fetching submissions:", error)
          return []
        }
      },

      fetchLeaderboard: async () => {
        try {
          // Add cache-busting parameter and headers
          const timestamp = new Date().getTime()
          const response = await fetch(`/api/leaderboard/weekly?_=${timestamp}`, {
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `Failed to fetch leaderboard: ${response.status}`)
          }

          const data = await response.json()

          // Format the data with position
          const formattedData = data.map((entry: any, index: number) => ({
            ...entry,
            position: index + 1,
          }))

          set({
            leaderboard: formattedData,
            leaderboardLoaded: true,
            leaderboardLastRefreshed: Date.now(),
          })

          return formattedData
        } catch (error: any) {
          console.error("Error fetching leaderboard:", error)
          return []
        }
      },

      fetchUserStreak: async (email: string) => {
        try {
          // Add cache-busting parameter and headers
          const timestamp = new Date().getTime()
          const response = await fetch(`/api/streaks?email=${encodeURIComponent(email)}&_=${timestamp}`, {
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `Failed to fetch user streak: ${response.status}`)
          }

          const data = await response.json()
          set({
            streakData: data,
            streakLoaded: true,
            lastRefreshed: Date.now(),
            hasSubmittedToday: false, // Reset the flag after fetching
          })
          return data
        } catch (error: any) {
          console.error("Error fetching user streak:", error)
          return null
        }
      },

      refreshData: async () => {
        set({
          submissionsLoaded: false,
          leaderboardLoaded: false,
          streakLoaded: false,
        })

        const userEmail = localStorage.getItem("rally_user_email")

        await get().fetchChallenges()
        await get().fetchCurrentChallenge()
        await get().fetchSubmissions()
        await get().fetchLeaderboard()

        if (userEmail) {
          await get().fetchUserStreak(userEmail)
        }

        set({
          lastRefreshed: Date.now(),
          submissionsLastRefreshed: Date.now(),
          leaderboardLastRefreshed: Date.now(),
        })
      },

      addSubmission: async (challengeId: string, submissionData: any) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch("/api/submissions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
            body: JSON.stringify({
              challenge_id: challengeId,
              ...submissionData,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `Failed to add submission: ${response.status}`)
          }

          const newSubmission = await response.json()

          // Update local state
          set((state) => ({
            submissions: [newSubmission, ...state.submissions],
            isLoading: false,
            hasSubmittedToday: true, // Set flag to true when user submits
          }))

          // Refresh streak data
          const userEmail = localStorage.getItem("rally_user_email")
          if (userEmail) {
            await get().fetchUserStreak(userEmail)
          }

          return newSubmission
        } catch (error: any) {
          console.error("Error adding submission:", error)
          set({ error: error.message, isLoading: false })
          return null
        }
      },

      sendCompliment: async (
        fromEmail: string,
        toEmail: string,
        challengeId: string,
        message: string,
        submissionId?: number,
      ) => {
        try {
          const response = await fetch("/api/complements", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
            body: JSON.stringify({
              from_user_email: fromEmail,
              to_user_email: toEmail,
              challenge_id: challengeId,
              message,
              submission_id: submissionId,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || `Failed to send compliment: ${response.status}`)
          }

          // Force refresh leaderboard after sending a compliment
          set({ leaderboardLoaded: false })
          await get().fetchLeaderboard()

          return await response.json()
        } catch (error: any) {
          console.error("Error sending compliment:", error)
          throw error
        }
      },

      setReminder: async (email: string) => {
        set({ isLoading: true })
        try {
          const response = await fetch("/api/reminders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
            body: JSON.stringify({ email }),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `Failed to set reminder: ${response.status}`)
          }

          set({ isLoading: false })
        } catch (error: any) {
          console.error("Error setting reminder:", error)
          set({ error: error.message, isLoading: false })
        }
      },
    }),
    {
      name: "rally-challenge-store",
      partialize: (state) => ({
        currentChallenge: state.currentChallenge,
        submissions: state.submissions,
        leaderboard: state.leaderboard,
        streakData: state.streakData,
        lastRefreshed: state.lastRefreshed,
        submissionsLastRefreshed: state.submissionsLastRefreshed,
        leaderboardLastRefreshed: state.leaderboardLastRefreshed,
        hasSubmittedToday: state.hasSubmittedToday,
      }),
    },
  ),
)
