<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from 'vue'
import { useGame } from '@/composables/useGame'
import GameBar from '@/components/GameBar.vue'
import type { Ad } from '@/types/ad'

const {
  loading,
  error,
  gameOver,
  game,
  reputation,
  ads,
  adResult,
  items,
  startNewGame,
  acceptAd,
  fetchAds,
  buyItem,
} = useGame()

const RESERVE_GOLD = 200
const OPTIMAL_GOLD = 500
const OPTIMAL_HEALTH = 7
const MAX_RISK = 6

const PROBABILITY_RISK_MAP = {
  'Piece of cake': 1,
  'Sure thing': 1,
  'Walk in the park': 1,
  'Quite likely': 2,
  Gamble: 3,
  Risky: 3,
  'Hmmm....': 3,
  'Rather detrimental': 4,
  'Playing with fire': 4,
  'Suicide mission': 5,
  Impossible: 6,
}

const UPGRADE_ITEMS = [
  'claw sharpening',
  'gasoline',
  'copper plating',
  'book of tricks',
  'potion of stronger wings',
  'claw honing',
  'rocket fuel',
  'iron plating',
  'book of megatricks',
  'awesome wings',
]

const isAutoPlaying = ref(false)
const autoPlayInterval = ref<number | null>(null)
const upgradeCounts = ref<Record<string, number>>(
  Object.fromEntries(UPGRADE_ITEMS.map((item) => [item, 0])),
)

function stopAutoPlay() {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
    autoPlayInterval.value = null
  }
  isAutoPlaying.value = false
}

function startNewAutoGame() {
  stopAutoPlay()
  startNewGame()
}

function findAffordableItem(itemName: string) {
  return items.value?.find(
    (item) => item.name.toLowerCase().includes(itemName) && item.cost <= (game.value?.gold || 0),
  )
}

function getAdScore(ad: Ad) {
  const probability = ad.encrypted ? atob(ad.probability) : ad.probability
  const risk = PROBABILITY_RISK_MAP[probability as keyof typeof PROBABILITY_RISK_MAP] || 7
  return ad.reward / risk / ad.expiresIn
}

async function makeMove() {
  if (loading.value || gameOver.value) return

  let acceptedAd = false

  await fetchAds()

  if (ads.value) {
    const bestAd = ads.value.reduce((prev, current) =>
      getAdScore(current) > getAdScore(prev) ? current : prev,
    )
    const probability = bestAd.encrypted ? atob(bestAd.probability) : bestAd.probability
    console.log(PROBABILITY_RISK_MAP[probability as keyof typeof PROBABILITY_RISK_MAP])
    acceptedAd = PROBABILITY_RISK_MAP[probability as keyof typeof PROBABILITY_RISK_MAP] <= MAX_RISK
    if (acceptedAd) {
      await acceptAd(bestAd.encrypted ? atob(bestAd.adId) : bestAd.adId)
    }
  }

  if (items.value && game.value) {
    const needsHealing = game.value.lives < OPTIMAL_HEALTH
    const needsUpgrade = game.value.gold > OPTIMAL_GOLD
    if (needsUpgrade) {
      if (needsUpgrade) {
        const sortedItems = [...UPGRADE_ITEMS].sort(
          (a, b) => upgradeCounts.value[a] - upgradeCounts.value[b],
        )
        for (const itemName of sortedItems) {
          if (game.value.gold < RESERVE_GOLD) break

          const item = findAffordableItem(itemName)
          if (item) {
            await buyItem(item.id)
            upgradeCounts.value[itemName]++
          }
        }
      }
    }

    if (needsHealing) {
      const item = findAffordableItem('healing')
      if (item) {
        await buyItem(item.id)
      }
    }
  }
}

function startAutoPlay() {
  isAutoPlaying.value = true
  autoPlayInterval.value = setInterval(makeMove, 2000)
}

onMounted(async () => {
  await startNewGame()
})

onUnmounted(() => {
  stopAutoPlay()
})

watch([() => error.value, () => game.value?.lives], ([error, lives]) => {
  if (error || (lives && lives < 1)) {
    stopAutoPlay()
  }
})
</script>

<template>
  <div class="game-container">
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="startNewAutoGame" class="medieval-button" :disabled="loading">
        Start a new game!
      </button>
    </div>

    <template v-else>
      <div class="controls">
        <button
          v-if="!gameOver"
          @click="isAutoPlaying ? stopAutoPlay() : startAutoPlay()"
          class="medieval-button"
          :disabled="loading || gameOver"
        >
          {{ isAutoPlaying ? 'Stop Auto-Play' : 'Start Auto-Play' }}
        </button>
        <button @click="startNewGame" class="medieval-button" :disabled="loading">New Game</button>
      </div>

      <template v-if="!gameOver">
        <GameBar :game="game" />

        <section v-if="reputation" class="reputation soft-red">
          <h1>Reputation</h1>
          <div class="reputation-stats">
            <p>
              People: <span>{{ reputation.people }}</span>
            </p>
            <p>
              State: <span>{{ reputation.state }}</span>
            </p>
            <p>
              Underworld: <span>{{ reputation.underworld }}</span>
            </p>
          </div>
        </section>

        <section v-if="adResult" class="ad-result">
          {{ adResult?.message }}
        </section>
      </template>

      <div class="game-status">
        <h2 v-if="gameOver" class="game-over">
          Game Over! We scored <span class="soft-red">{{ game?.score }}</span> points!
        </h2>
        <h2 v-else>Status: {{ isAutoPlaying ? 'Auto-Playing' : 'Idle' }}</h2>
      </div>
    </template>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
