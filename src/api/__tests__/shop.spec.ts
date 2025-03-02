import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shopService } from '../shop'
import fetchApi from '../config/config'

vi.mock('../config/config')

describe('investigationService', () => {
  const mockGameId = 'test-123'

  const mockItems = [
    {
      id: 'item-123',
      name: 'Gasoline',
      cost: 100,
    },
  ]

  const mockItemResult = {
    shoppingSuccess: true,
    gold: 20,
    lives: 3,
    level: 0,
    turn: 7,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get items', async () => {
    vi.mocked(fetchApi).mockResolvedValue(mockItems)

    const result = await shopService.get(mockGameId)

    expect(fetchApi).toHaveBeenCalledWith(`/${mockGameId}/shop`)
    expect(result).toEqual(mockItems)
  })

  it('should buy item', async () => {
    vi.mocked(fetchApi).mockResolvedValue(mockItemResult)

    const result = await shopService.buy(mockGameId, 'item-123')

    expect(fetchApi).toHaveBeenCalledWith(`/${mockGameId}/shop/buy/item-123`, {
      method: 'POST',
    })
    expect(result).toEqual(mockItemResult)
  })

  it('should handle errors when getting items', async () => {
    const error = new Error('Network error')
    vi.mocked(fetchApi).mockRejectedValue(error)

    await expect(shopService.get(mockGameId)).rejects.toThrow('Network error')
  })

  it('should handle errors when buying item', async () => {
    const error = new Error('Network error')
    vi.mocked(fetchApi).mockRejectedValue(error)

    await expect(shopService.buy(mockGameId, 'item-123')).rejects.toThrow('Network error')
  })
})
