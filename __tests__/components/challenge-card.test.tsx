import { render, screen } from "@testing-library/react"
import { ChallengeCard } from "@/components/challenge-card"
import { useChallengeStore } from "@/lib/store"

// Mock the store
jest.mock("@/lib/store", () => ({
  useChallengeStore: jest.fn(),
}))

describe("ChallengeCard", () => {
  it("displays loading state", () => {
    ;(useChallengeStore as jest.Mock).mockReturnValue({
      currentChallenge: null,
      submissions: {},
      isLoading: true,
      error: null,
      fetchCurrentChallenge: jest.fn(),
    })

    render(<ChallengeCard />)

    expect(screen.getByText("Loading today's challenge...")).toBeInTheDocument()
  })

  it("displays error state", () => {
    ;(useChallengeStore as jest.Mock).mockReturnValue({
      currentChallenge: null,
      submissions: {},
      isLoading: false,
      error: "Failed to load challenge",
      fetchCurrentChallenge: jest.fn(),
    })

    render(<ChallengeCard />)

    expect(screen.getByText("Error: Failed to load challenge")).toBeInTheDocument()
  })

  it("displays challenge details", () => {
    const mockChallenge = {
      id: "1",
      title: "Test Challenge",
      description: "This is a test challenge",
      category: "Testing",
      difficulty: "Easy",
      hashtag: "#TestChallenge",
      quote: "Test quote",
      author: "Test Author",
      scheduled_date: "2025-01-01",
      is_current: true,
    }
    ;(useChallengeStore as jest.Mock).mockReturnValue({
      currentChallenge: mockChallenge,
      submissions: { "1": 5 },
      isLoading: false,
      error: null,
      fetchCurrentChallenge: jest.fn(),
    })

    render(<ChallengeCard />)

    expect(screen.getByText("Test Challenge")).toBeInTheDocument()
    expect(screen.getByText("This is a test challenge")).toBeInTheDocument()
    expect(screen.getByText("Testing")).toBeInTheDocument()
    expect(screen.getByText("Easy")).toBeInTheDocument()
    expect(screen.getByText('"Test quote"')).toBeInTheDocument()
    expect(screen.getByText("— Test Author")).toBeInTheDocument()
  })
})
