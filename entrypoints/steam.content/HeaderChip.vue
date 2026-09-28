<script setup lang="ts">
import { computed } from 'vue';
import KrakenLogo from '@/components/KrakenLogo.vue';
import { formatPrice } from '@/utils/format';
import { FontAwesomeIcon } from '@/utils/icons';
import { useDeal } from '@/utils/useDeal';

const HIGHLIGHT_MS = 1600;

const { state, best, saving, steamIsCheapest } = useDeal();

const currency = computed(() => state.deal?.currency ?? 'GBP');

function jumpToDeal() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelector('krakenkeys-deal')?.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth',
    block: 'center',
  });

  state.highlight = true;
  setTimeout(() => (state.highlight = false), HIGHLIGHT_MS);
}
</script>

<template>
  <div v-if="state.status === 'loading' || (state.status === 'ready' && best)" class="mb-3 font-steam">
    <div v-if="state.status === 'loading'" class="h-[30px] w-60 animate-pulse rounded bg-steam-row motion-reduce:animate-none" />
    <button
      v-else-if="best"
      type="button"
      class="group inline-flex max-w-full items-center gap-2 rounded border border-steam-line bg-steam-panel px-2.5 py-1.5 text-[13px] text-steam-text transition-colors hover:border-kraken focus-visible:outline focus-visible:outline-2 focus-visible:outline-kraken"
      @click="jumpToDeal"
    >
      <KrakenLogo class="h-4 w-4 shrink-0 text-kraken" />
      <template v-if="steamIsCheapest">
        <span class="truncate">Steam's the cheapest right now</span>
        <FontAwesomeIcon icon="circle-check" class="h-3 w-3 text-steam-sale" />
      </template>
      <template v-else>
        <span class="truncate">
          <span class="font-bold text-white">{{ formatPrice(best.final_price, currency) }}</span> on KrakenKeys
        </span>
        <span v-if="saving" class="shrink-0 rounded-sm bg-steam-sale-bg px-1.5 text-xs text-steam-sale">-{{ saving.percent }}%</span>
      </template>
      <FontAwesomeIcon icon="chevron-down" class="h-2.5 w-2.5 shrink-0 text-steam-muted group-hover:text-white" />
    </button>
  </div>
</template>
