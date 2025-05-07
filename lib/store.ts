import { create } from "zustand"

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
}

interface ChallengeState {
  challenges: Challenge[]
  currentChallenge: Challenge | null
  submissions: { [challengeId: string]: number }
  isLoading: boolean
  error: string | null
  fetchChallenges: () => Promise<void>
  fetchCurrentChallenge: () => Promise<void>
  addChallenge: (challenge: Omit<Challenge, "id">) => Promise<void>
  updateChallenge: (id: string, challenge: Partial<Challenge>) => Promise<void>
  deleteChallenge: (id: string) => Promise<void>
  setCurrentChallenge: (challenge: Challenge) => Promise<void>
  addSubmission: (
    challengeId: string,
    submissionData: Omit<Submission, "id" | "created_at">,
  ) => Promise<Submission | null>
  setReminder: (email: string) => Promise<void>
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenges: [],
  currentChallenge: null,
  submissions: {},
  isLoading: false,
  error: null,
  fetchChallenges: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/challenges")
      if (!response.ok) {
        throw new Error("Failed to fetch challenges")
      }
      const data: Challenge[] = await response.json()
      set({ challenges: data, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  fetchCurrentChallenge: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/challenges/current")
      if (!response.ok) {
        throw new Error("Failed to fetch current challenge")
      }
      const data: Challenge = await response.json()
      set({ currentChallenge: data, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  addChallenge: async (challenge: Omit<Challenge, "id">) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(challenge),
      })
      if (!response.ok) {
        throw new Error("Failed to add challenge")
      }
      const newChallenge: Challenge = await response.json()
      set((state) => ({
        challenges: [...state.challenges, newChallenge],
        isLoading: false,
      }))
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  updateChallenge: async (id: string, challenge: Partial<Challenge>) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/challenges/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(challenge),
      })
      if (!response.ok) {
        throw new Error("Failed to update challenge")
      }
      const updatedChallenge: Challenge = await response.json()
      set((state) => ({
        challenges: state.challenges.map((c) => (c.id === id ? updatedChallenge : c)),
        isLoading: false,
      }))
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  deleteChallenge: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/challenges/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete challenge")
      }
      set((state) => ({
        challenges: state.challenges.filter((challenge) => challenge.id !== id),
        isLoading: false,
      }))
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  setCurrentChallenge: async (challenge: Challenge) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/challenges/current", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: challenge.id }),
      })
      if (!response.ok) {
        throw new Error("Failed to set current challenge")
      }
      set({ currentChallenge: challenge, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
  addSubmission: async (challengeId: string, submissionData: Omit<Submission, "id" | "created_at">) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...submissionData, challenge_id: challengeId }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to submit entry: ${response.status}`)
      }

      const newSubmission: Submission = await response.json()
      set({
        submissions: {
          ...get().submissions,
          [challengeId]: (get().submissions[challengeId] || 0) + 1,
        },
        isLoading: false,
      })
      return newSubmission
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      return null
    }
  },
  setReminder: async (email: string) => {
    set({ isLoading: true })
    try {
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("Failed to set reminder")
      }

      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
}))
