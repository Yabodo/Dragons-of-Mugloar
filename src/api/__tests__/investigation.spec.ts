import { describe, it, expect, vi, beforeEach } from 'vitest'
import { investigationService } from '../investigation'
import fetchApi from '../config/config'

vi.mock('../config/config')

describe('investigationService', () => {
  const mockGameId = 'test-123'

  const mockReputation = {
    people: 0,
    state: 0,
    underworld: 0,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get reputation', async () => {
    vi.mocked(fetchApi).mockResolvedValue(mockReputation)

    const result = await investigationService.start(mockGameId)

    expect(fetchApi).toHaveBeenCalledWith(`/${mockGameId}/investigate/reputation`, {
      method: 'POST',
    })
    expect(result).toEqual(mockReputation)
  })

  it('should handle errors when getting reputation', async () => {
    const error = new Error('Network error')
    vi.mocked(fetchApi).mockRejectedValue(error)

    await expect(investigationService.start(mockGameId)).rejects.toThrow('Network error')
  })
})
