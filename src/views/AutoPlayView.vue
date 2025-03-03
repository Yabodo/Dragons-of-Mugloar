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

const MOVE_INTERVAL = 200
const RESERVE_GOLD = 300
const OPTIMAL_GOLD = 500
const OPTIMAL_HEALTH = 10

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
const autoPlayInterval = ref<ReturnType<typeof setInterval> | null>(null)
const upgradeCounts = ref<Record<string, number>>(
  Object.fromEntries(UPGRADE_ITEMS.map((item) => [item, 0])),
)

function tryDecode(str: string): string {
  try {
    return atob(str)
  } catch {
    return str
  }
}

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
  const probability = ad.encrypted ? tryDecode(ad.probability) : ad.probability
  const message = (ad.encrypted ? tryDecode(ad.message) : ad.message).toLowerCase()
  const enemyOfState = message.includes('steal') // -2 state
  const defenderOfPeople = message.includes('help defending') // 1 people
  const robinHood = message.includes('share some of the profits with the people') // 1 people
  const diplomat = message.includes('to reach agreement') // 0.2 people
  const advertiser = message.includes('create an advertisement campaign') //0.2 people
  const transporter = message.includes('to transport') // 0.1 people
  const escorter = message.includes('escort') // 0.1 people
  const risk = PROBABILITY_RISK_MAP[probability as keyof typeof PROBABILITY_RISK_MAP] || 7
  return (
    (10_000_000 * ad.reward) /
    risk /
    (enemyOfState ? 2 : 1) /
    (defenderOfPeople ? 10 : 1) /
    (robinHood ? 10 : 1) /
    (diplomat ? 3 : 1) /
    (advertiser ? 3 : 1) /
    (transporter ? 2 : 1) /
    (escorter ? 2 : 1)
  )
}

async function makeMove() {
  if (loading.value || gameOver.value) return

  await fetchAds()

  if (ads.value) {
    const sortedAds = ads.value.sort((a, b) => b.expiresIn - a.expiresIn)
    const bestAd = sortedAds.reduce((prev, current) =>
      getAdScore(current) > getAdScore(prev) ? current : prev,
    )
    await acceptAd(bestAd.encrypted ? tryDecode(bestAd.adId) : bestAd.adId)
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
  autoPlayInterval.value = setInterval(makeMove, MOVE_INTERVAL)
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
        <h2 v-if="gameOver && !loading" class="game-over">
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
