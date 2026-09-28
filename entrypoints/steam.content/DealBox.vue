<script setup lang="ts">
import { computed } from 'vue';
import CouponCode from '@/components/CouponCode.vue';
import DealChip from '@/components/DealChip.vue';
import DealPanel from '@/components/DealPanel.vue';
import KrakenLogo from '@/components/KrakenLogo.vue';
import { copyText } from '@/utils/clipboard';
import { formatMonth, formatPrice } from '@/utils/format';
import { FontAwesomeIcon } from '@/utils/icons';
import { useDeal } from '@/utils/useDeal';

const { state, best, saving, steamIsCheapest, lowestEver, storeCount } = useDeal();

const currency = computed(() => state.deal?.currency ?? 'GBP');

const showLowestEver = computed(() =>
  !!lowestEver.value && !!best.value && best.value.final_price > lowestEver.value.price + 0.005,
);

function copyCouponOnBuy() {
  if (best.value?.coupon) {
    copyText(best.value.coupon.code);
  }
}

function togglePanel() {
  state.panelOpen = !state.panelOpen;
}
</script>

<template>
  <section
    v-if="state.status === 'loading' || state.status === 'ready'"
    aria-label="KrakenKeys prices"
    class="mb-4 rounded-md border bg-steam-panel font-steam text-steam-text transition-shadow duration-500"
    :class="state.highlight ? 'border-kraken shadow-[0_0_0_3px_rgba(127,42,255,0.35)]' : 'border-steam-line'"
  >
    <div class="flex items-center gap-2 px-4 pt-3 text-xs">
      <KrakenLogo class="h-5 w-5 text-kraken" />
      <span class="font-medium text-steam-text">KrakenKeys</span>
      <span class="ml-auto"><DealChip v-if="state.status === 'ready'" /></span>
    </div>

    <div v-if="state.status === 'loading'" class="flex items-center gap-4 px-4 pb-3.5 pt-2" aria-busy="true">
      <div class="flex-1">
        <div class="h-[26px] w-56 animate-pulse rounded bg-steam-row motion-reduce:animate-none" />
        <div class="mt-2 h-3 w-72 max-w-full animate-pulse rounded bg-steam-row motion-reduce:animate-none" />
      </div>
      <div class="h-9 w-32 animate-pulse rounded bg-steam-row motion-reduce:animate-none" />
    </div>

    <div v-else-if="best" class="flex flex-col gap-3 px-4 pb-3.5 pt-2 sm:flex-row sm:items-center sm:gap-4">
      <div class="min-w-0 flex-1 cursor-pointer" @click="togglePanel">
        <template v-if="steamIsCheapest">
          <span class="flex items-center gap-2 text-[15px] text-white">
            <FontAwesomeIcon icon="circle-check" class="h-4 w-4 text-steam-sale" />
            Steam's the cheapest right now
          </span>
          <span class="mt-1.5 block text-xs text-steam-muted">
            We checked {{ storeCount }} stores, fees and coupons included
          </span>
        </template>
        <template v-else>
          <span class="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span class="text-[26px] font-bold leading-none text-white">{{ formatPrice(best.final_price, currency) }}</span>
            <span class="text-sm">at {{ best.provider }}</span>
            <span v-if="saving" class="rounded-sm bg-steam-sale-bg px-1.5 py-0.5 text-xs text-steam-sale">
              {{ formatPrice(saving.amount, currency) }} cheaper than Steam
            </span>
          </span>
          <span class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-steam-muted">
            <template v-if="best.coupon">
              <CouponCode :code="best.coupon.code" :discount="best.coupon.discount_percentage" />
              <span>Copied for you when you click buy</span>
            </template>
            <span v-else>Fees and coupons included</span>
          </span>
          <span v-if="showLowestEver && lowestEver" class="mt-1 flex items-center gap-1.5 text-xs text-steam-muted">
            <FontAwesomeIcon icon="arrow-trend-down" class="h-3 w-3" />
            Lowest ever: <span class="text-steam-text">{{ formatPrice(lowestEver.price, currency) }}</span>
            <template v-if="lowestEver.date">({{ formatMonth(lowestEver.date) }})</template>
          </span>
        </template>
      </div>

      <div class="flex shrink-0 flex-col gap-2 sm:items-end">
        <a
          v-if="!steamIsCheapest"
          :href="best.url"
          target="_blank"
          rel="noopener sponsored"
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded bg-kraken px-3.5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-kraken-hover sm:py-2"
          :title="best.coupon ? `Copies code ${best.coupon.code} for you` : undefined"
          @click="copyCouponOnBuy"
        >
          Buy at {{ best.provider }}
          <FontAwesomeIcon icon="arrow-up-right-from-square" class="h-3 w-3" />
        </a>
        <button
          type="button"
          class="inline-flex items-center justify-center gap-1.5 rounded border border-steam-line py-2.5 text-[13px] text-steam-blue transition-colors hover:border-steam-blue hover:text-white sm:border-0 sm:py-0"
          :aria-expanded="state.panelOpen"
          aria-controls="kk-panel"
          @click="togglePanel"
        >
          {{ state.panelOpen ? 'Hide stores' : `Compare ${storeCount} stores` }}
          <FontAwesomeIcon
            icon="chevron-down"
            class="h-3 w-3 transition-transform motion-reduce:transition-none"
            :class="state.panelOpen ? 'rotate-180' : ''"
          />
        </button>
      </div>
    </div>

    <DealPanel v-if="state.panelOpen" id="kk-panel" />
  </section>
</template>
