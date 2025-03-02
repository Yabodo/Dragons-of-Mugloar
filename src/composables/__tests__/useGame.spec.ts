import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGame } from '../useGame'
import { gameService } from '@/api/game'
import { investigationService } from '@/api/investigation'
import { adService } from '@/api/ad'
import { shopService } from '@/api/shop'

// Mock all API services
vi.mock('@/api/game', () => ({
  gameService: {
    start: vi.fn(),
  },
}))

vi.mock('@/api/investigation', () => ({
  investigationService: {
    start: vi.fn(),
  },
}))

vi.mock('@/api/ad', () => ({
  adService: {
    get: vi.fn(),
    acceptAd: vi.fn(),
  },
}))

vi.mock('@/api/shop', () => ({
  shopService: {
    get: vi.fn(),
    buy: vi.fn(),
  },
}))

describe('useGame', () => {
  const mockGame = {
    gameId: 'test-123',
    lives: 3,
    gold: 100,
    level: 1,
    score: 0,
    highScore: 0,
    turn: 1,
  }

  const mockReputation = {
    people: 0,
    state: 0,
    underworld: 0,
  }

  const mockAds = [
    {
      adId: 'ad-123',
      message: 'Test ad',
      probability: 'Piece of cake',
      reward: 100,
      expiresIn: 5,
      encrypted: false,
    },
  ]

  const mockItems = [
    {
      id: 'item-123',
      name: 'Test Item',
      cost: 50,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset default mock implementations
    vi.mocked(gameService.start).mockResolvedValue(mockGame)
    vi.mocked(investigationService.start).mockResolvedValue(mockReputation)
    vi.mocked(adService.get).mockResolvedValue(mockAds)
    vi.mocked(shopService.get).mockResolvedValue(mockItems)
  })

  it('should initialize with default values', () => {
    const { loading, error, gameOver, game, reputation, ads, items } = useGame()

    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(gameOver.value).toBe(false)
    expect(game.value).toBeNull()
    expect(reputation.value).toBeNull()
    expect(ads.value).toBeNull()
    expect(items.value).toBeNull()
  })

  it('should handle game start successfully', async () => {
    const { startNewGame, game, reputation, loading, error } = useGame()

    await startNewGame()

    expect(gameService.start).toHaveBeenCalled()
    expect(investigationService.start).toHaveBeenCalledWith(mockGame.gameId)
    expect(game.value).toEqual(mockGame)
    expect(reputation.value).toEqual(mockReputation)
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('should handle game start error', async () => {
    const errorMessage = 'Network error'
    vi.mocked(gameService.start).mockRejectedValue(new Error(errorMessage))

    const { startNewGame, game, error, loading } = useGame()

    await startNewGame()

    expect(game.value).toBeNull()
    expect(error.value).toContain('start game')
    expect(loading.value).toBe(false)
  })

  it('should fetch ads when game starts', async () => {
    const { startNewGame, ads } = useGame()

    await startNewGame()

    expect(adService.get).toHaveBeenCalledWith(mockGame.gameId)
    expect(ads.value).toEqual(mockAds)
  })

  it('should accept ad successfully', async () => {
    const mockAdResult = {
      success: true,
      lives: 3,
      gold: 150,
      score: 10,
      highScore: 10,
      turn: 2,
      message: 'Success',
    }
    vi.mocked(adService.acceptAd).mockResolvedValue(mockAdResult)

    const { startNewGame, acceptAd, adResult, game } = useGame()
    await startNewGame()
    await acceptAd('ad-123')

    expect(adService.acceptAd).toHaveBeenCalledWith(mockGame.gameId, 'ad-123')
    expect(adResult.value).toEqual(mockAdResult)
    expect(game.value?.gold).toBe(mockAdResult.gold)
  })

  it('should update game state after buying items', async () => {
    const mockItemResult = {
      shoppingSuccess: true,
      gold: 50,
      lives: 4,
      level: 1,
      turn: 2,
    }
    vi.mocked(shopService.buy).mockResolvedValue(mockItemResult)

    const { startNewGame, buyItem, game } = useGame()
    await startNewGame()
    await buyItem('item-123')

    expect(shopService.buy).toHaveBeenCalledWith(mockGame.gameId, 'item-123')
    expect(game.value?.gold).toBe(mockItemResult.gold)
    expect(game.value?.lives).toBe(mockItemResult.lives)
  })

  it('should handle game over when lives reach 0', async () => {
    const mockDeadlyResult = {
      success: false,
      lives: 0,
      gold: 0,
      score: 0,
      highScore: 10,
      turn: 3,
      message: 'You died',
    }
    vi.mocked(adService.acceptAd).mockResolvedValue(mockDeadlyResult)

    const { startNewGame, acceptAd, gameOver } = useGame()
    await startNewGame()
    await acceptAd('ad-123')

    expect(gameOver.value).toBe(true)
  })
})
