<script setup lang="ts">
import type { Game } from '@/types/game'
import GameBarStat from './GameBarStat.vue'
import IconHealth from './icons/IconHealth.vue'
import IconGold from './icons/IconGold.vue'
import IconTurn from './icons/IconTurn.vue'
import IconLevel from './icons/IconLevel.vue'
import IconScore from './icons/IconScore.vue'

defineProps<{
  game: Game | null
}>()
</script>

<template>
  <div class="soft-red stat-bar">
    <template v-if="game">
      <GameBarStat labelText="Lives">
        <IconHealth class="stat-icon" />
        <p>{{ game.lives }}</p>
      </GameBarStat>
      <GameBarStat labelText="Gold">
        <IconGold class="stat-icon" />
        <p>{{ game.gold }}</p>
      </GameBarStat>
      <GameBarStat labelText="Turn">
        <IconTurn class="stat-icon" />
        <p>{{ game.turn }}</p>
      </GameBarStat>
      <GameBarStat labelText="Level">
        <IconLevel class="stat-icon" />
        <p>{{ game.level }}</p>
      </GameBarStat>
      <GameBarStat labelText="Score">
        <IconScore class="stat-icon" />
        <p>{{ game.score }}</p>
      </GameBarStat>
    </template>
  </div>
</template>

<style scoped>
.stat-bar {
  display: flex;
  padding: 2rem 0;
}

.stat-icon {
  margin-right: 0.5rem;
}

@media (min-width: 1024px) {
  .stat-bar {
    text-align: left;
  }
}
</style>
