import { describe, it, expect, vi, beforeEach } from 'vitest'
import { adService } from '../message'
import fetchApi from '../config/config'

vi.mock('../config/config')

describe('adService', () => {
  const mockGameId = 'test-123'

  const mockAds = [
    {
      adId: 'ad-123',
      message: 'Save us all!',
      probability: 'Piece of cake',
      reward: 100,
      expiresIn: 6,
      encrypted: false,
    },
  ]

  const mockAdResult = {
    success: true,
    lives: 3,
    gold: 120,
    score: 150,
    highScore: 150,
    turn: 7,
    message: 'Great success!',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get ads', async () => {
    vi.mocked(fetchApi).mockResolvedValue(mockAds)

    const result = await adService.get(mockGameId)

    expect(fetchApi).toHaveBeenCalledWith(`/${mockGameId}/messages`)
    expect(result).toEqual(mockAds)
  })

  it('should accept ad', async () => {
    vi.mocked(fetchApi).mockResolvedValue(mockAdResult)

    const result = await adService.acceptAd(mockGameId, 'ad-123')

    expect(fetchApi).toHaveBeenCalledWith(`/${mockGameId}/solve/ad-123`, { method: 'POST' })
    expect(result).toEqual(mockAdResult)
  })

  it('should handle errors when getting ads', async () => {
    const error = new Error('Network error')
    vi.mocked(fetchApi).mockRejectedValue(error)

    await expect(adService.get(mockGameId)).rejects.toThrow('Network error')
  })

  it('should handle errors when accepting ads', async () => {
    const error = new Error('Network error')
    vi.mocked(fetchApi).mockRejectedValue(error)

    await expect(adService.acceptAd(mockGameId, 'ad-123')).rejects.toThrow('Network error')
  })
})
