import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GameBar from '../GameBar.vue'
import GameBarStat from '../GameBarStat.vue'

describe('GameBar', () => {
  const mockGame = {
    gameId: 'test-123',
    lives: 1,
    gold: 200,
    level: 3,
    score: 4,
    highScore: 1500,
    turn: 6,
  }

  it('renders game stats correctly', () => {
    const wrapper = mount(GameBar, {
      props: { game: mockGame },
    })

    expect(wrapper.text()).toContain(mockGame.lives.toString())
    expect(wrapper.text()).toContain(mockGame.gold.toString())
    expect(wrapper.text()).toContain(mockGame.level.toString())
    expect(wrapper.text()).toContain(mockGame.score.toString())
    expect(wrapper.text()).toContain(mockGame.turn.toString())

    const stats = wrapper.findAllComponents(GameBarStat)
    expect(stats).toHaveLength(5)
  })

  it('handles null game prop', () => {
    const wrapper = mount(GameBar, {
      props: { game: null },
    })

    expect(wrapper.find('.stat-bar').exists()).toBe(true)
    expect(wrapper.text()).toBe('')
  })
})
