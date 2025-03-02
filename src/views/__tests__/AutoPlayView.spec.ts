import { ref } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AutoPlayView from '@/views/AutoPlayView.vue'
import { useGame } from '@/composables/useGame'
import type { Game } from '@/types/game'
import type { Ad } from '@/types/ad'
import type { Item } from '@/types/item'

vi.mock('@/composables/useGame')

describe('PlayView', () => {
  const mockGame: Game = {
    gameId: 'test-123',
    lives: 3,
    gold: 100,
    level: 1,
    score: 0,
    highScore: 0,
    turn: 1,
  }

  const mockAds: Ad[] = [
    {
      adId: 'ad-123',
      message: 'Test message',
      probability: 'Piece of cake',
      reward: 100,
      expiresIn: 5,
      encrypted: false,
    },
  ]

  const mockItems: Item[] = [
    {
      id: 'item-123',
      name: 'Test Item',
      cost: 50,
    },
  ]

  const mockUseGame = {
    loading: ref(false),
    error: ref<null | string>(null),
    gameOver: ref(false),
    game: ref<Game | null>(mockGame),
    reputation: ref(null),
    ads: ref<Ad[] | null>(mockAds),
    adResult: ref(null),
    items: ref<Item[] | null>(mockItems),
    itemResult: ref(null),
    fetchItems: vi.fn(),
    startNewGame: vi.fn(),
    acceptAd: vi.fn(),
    fetchAds: vi.fn(),
    buyItem: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useGame).mockReturnValue(mockUseGame)
  })

  it('should render game interface', () => {
    const wrapper = mount(AutoPlayView)

    expect(wrapper.find('.game-container').exists()).toBe(true)
    expect(wrapper.find('.error-message').exists()).toBe(false)
  })

  it('should show error message when error occurs', async () => {
    mockUseGame.error.value = 'Test error'
    vi.mocked(useGame).mockReturnValue(mockUseGame)

    const wrapper = mount(AutoPlayView)

    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test error')
  })

  it('should start new game on mount', () => {
    mount(AutoPlayView)
    expect(mockUseGame.startNewGame).toHaveBeenCalled()
  })
})
