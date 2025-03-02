import { describe, it, expect, vi, beforeEach } from 'vitest'
import { gameService } from '../game'
import fetchApi from '../config/config'

// Mock the fetchApi module
vi.mock('../config/config', () => ({
  default: vi.fn(),
}))

describe('gameService', () => {
  const mockGame = {
    gameId: 'test-123',
    lives: 3,
    gold: 100,
    level: 1,
    score: 0,
    highScore: 0,
    turn: 1,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should start a new game', async () => {
    // Setup the mock response
    vi.mocked(fetchApi).mockResolvedValue(mockGame)

    // Call the service method
    const result = await gameService.start()

    // Verify fetchApi was called with correct parameters
    expect(fetchApi).toHaveBeenCalledWith('/game/start', { method: 'POST' })

    // Verify the result
    expect(result).toEqual(mockGame)
  })

  it('should propagate errors from fetchApi', async () => {
    // Setup the mock to throw an error
    const error = new Error('Network error')
    vi.mocked(fetchApi).mockRejectedValue(error)

    // Verify the error is propagated
    await expect(gameService.start()).rejects.toThrow('Network error')
  })
})
