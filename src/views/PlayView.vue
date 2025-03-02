<script setup lang="ts">
import { onMounted } from 'vue'
import { useGame } from '@/composables/useGame'
import GameBar from '@/components/GameBar.vue'

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

async function accept(adId: string) {
  await acceptAd(adId)
  await fetchAds()
}

onMounted(async () => {
  startNewGame()
})
</script>

<template>
  <div class="game-container">
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="startNewGame" class="medieval-button" :disabled="loading">
        Start a new game!
      </button>
    </div>

    <template v-else-if="!gameOver">
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

      <section class="ads-items-container">
        <div class="ads-container">
          <h2>Available Ads:</h2>
          <div v-if="ads?.length" class="ads-list">
            <div v-for="ad in ads" :key="ad.adId" class="message">
              <button @click="accept(ad.adId)" class="medieval-button" :disabled="loading">
                Accept
              </button>
              <div class="message-stats">
                <p>Reward: {{ ad.reward }}</p>
                <p>Probability: {{ ad.probability }}</p>
                <p>Turns left: {{ ad.expiresIn }}</p>
                <p>{{ ad.message }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="items-container">
          <h2>Available Items:</h2>
          <div v-if="items?.length" class="ads-list">
            <div v-for="item in items" :key="item.id" class="message">
              <button @click="buyItem(item.id)" class="medieval-button" :disabled="loading">
                Buy
              </button>
              <div class="message-stats">
                <p class="soft-red">{{ item.name }}</p>
                <p>Cost: {{ item.cost }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
    <template v-else>
      <button @click="startNewGame" class="medieval-button" :disabled="loading">
        Start a new game!
      </button>
    </template>
  </div>
</template>

<style scoped>
.ads-items-container {
  display: flex;
}

.message {
  display: flex;
  padding: 0.5rem;
  border: 1px solid white;
  max-width: 500px;
}

.message-stats {
  padding: 1rem;
  overflow-wrap: anywhere;
}

@media (min-width: 1024px) {
  .game-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
