<script setup lang="ts">
defineProps<{
  labelText?: string
}>()
</script>

<template>
  <div class="tooltip">
    <div class="soft-red game-stat">
      <slot/>
    </div>
    <span v-if="labelText" class="tooltiptext">{{ labelText }}</span>
  </div>
</template>

<style scoped>
.game-stat {
  font-weight: 500;
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
  position: relative;
  top: -10px;
}

.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
 
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
