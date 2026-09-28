<script setup lang="ts">
import { computed } from 'vue';
import { FontAwesomeIcon } from '@/utils/icons';
import { useDeal } from '@/utils/useDeal';

const { isLowestEver, verdict } = useDeal();

const chip = computed(() => {
  if (isLowestEver.value) {
    return { label: 'Lowest ever', icon: 'arrow-trend-down', good: true };
  }

  if (verdict.value) {
    return verdict.value.state === 'good'
      ? { label: 'Good price', icon: 'circle-check', good: true }
      : { label: 'Fair price', icon: 'circle-info', good: false };
  }

  return null;
});
</script>

<template>
  <span
    v-if="chip"
    class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
    :class="chip.good ? 'bg-steam-sale-bg text-steam-sale' : 'bg-steam-row text-steam-text'"
  >
    <FontAwesomeIcon :icon="chip.icon" class="h-3 w-3" />
    {{ chip.label }}
  </span>
</template>
