import { ref, watch } from 'vue'
import { gameService } from '@/api/game'
import type { Game } from '@/types/game'
import { investigationService } from '@/api/investigation'
import type { Reputation } from '@/types/reputation'
import { adService } from '@/api/ad'
import type { Ad, AdResult } from '@/types/ad'
import { shopService } from '@/api/shop'
import type { Item, ItemResult } from '@/types/item'

export function useGame() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const gameOver = ref(false)
  const game = ref<Game | null>(null)
  const reputation = ref<Reputation | null>(null)
  const ads = ref<Ad[] | null>(null)
  const adResult = ref<AdResult | null>(null)
  const items = ref<Item[] | null>(null)
  const itemResult = ref<ItemResult | null>(null)

  const handleError = (err: unknown, context: string) => {
    console.error(`Failed to ${context}:`, err)
    error.value = `Failed to ${context}. Please try to start a new game.`
  }

  async function fetchAds() {
    if (!game.value?.gameId) return

    loading.value = true
    error.value = null

    try {
      ads.value = await adService.get(game.value.gameId)
    } catch (err) {
      handleError(err, 'fetch messages')
    } finally {
      loading.value = false
    }
  }

  async function acceptAd(id: string) {
    if (!game.value?.gameId) return

    loading.value = true
    error.value = null

    try {
      adResult.value = await adService.acceptAd(game.value.gameId, id)
    } catch (err) {
      handleError(err, 'accept ad')
    } finally {
      loading.value = false
    }
  }

  async function fetchItems() {
    if (!game.value?.gameId) return

    loading.value = true
    error.value = null

    try {
      items.value = await shopService.get(game.value.gameId)
    } catch (err) {
      handleError(err, 'fetch items')
    } finally {
      loading.value = false
    }
  }

  async function buyItem(id: string) {
    if (!game.value?.gameId) return

    loading.value = true
    error.value = null

    try {
      itemResult.value = await shopService.buy(game.value.gameId, id)

      if (game.value) {
        const { gold, lives, level, turn } = itemResult.value
        Object.assign(game.value, { gold, lives, level, turn })
      }
    } catch (err) {
      handleError(err, 'buy item')
    } finally {
      loading.value = false
    }
  }

  async function fetchInvestigation() {
    if (!game.value?.gameId) return

    loading.value = true
    error.value = null

    try {
      reputation.value = await investigationService.start(game.value.gameId)
    } catch (err) {
      handleError(err, 'fetch reputation')
    } finally {
      loading.value = false
    }
  }

  async function startNewGame() {
    loading.value = true
    error.value = null

    try {
      game.value = await gameService.start()
      await fetchInvestigation()
      gameOver.value = false
    } catch (err) {
      handleError(err, 'start game')
    } finally {
      loading.value = false
    }
  }

  // Set up watchers
  watch(
    () => game.value?.gameId,
    (newVal) => {
      if (newVal) {
        fetchAds()
        fetchItems()
      }
    },
  )

  watch(
    () => adResult.value,
    (newVal) => {
      if (newVal?.lives && newVal?.lives > 0) {
        fetchItems()
        fetchInvestigation()
        if (game.value) {
          const { gold, highScore, lives, score, turn } = newVal
          Object.assign(game.value, { gold, highScore, lives, score, turn })
        }
      } else {
        gameOver.value = true
        adResult.value = null
      }
    },
  )

  return {
    loading,
    error,
    gameOver,
    game,
    reputation,
    ads,
    adResult,
    items,
    itemResult,
    fetchItems,
    startNewGame,
    acceptAd,
    fetchAds,
    buyItem,
  }
}
