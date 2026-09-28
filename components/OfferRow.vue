<script setup lang="ts">
import type { Offer } from '@/utils/api';
import { copyText } from '@/utils/clipboard';
import { formatPrice } from '@/utils/format';
import { FontAwesomeIcon } from '@/utils/icons';
import CouponCode from './CouponCode.vue';

const props = defineProps<{ offer: Offer; currency: string; cheapest: boolean }>();

function copyCouponOnBuy() {
  if (props.offer.coupon) {
    copyText(props.offer.coupon.code);
  }
}
</script>

<template>
  <li
    class="flex items-center gap-3 rounded px-3 py-2.5"
    :class="cheapest ? 'bg-kraken-soft/60 ring-1 ring-inset ring-kraken/50' : ''"
  >
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-2">
        <span class="truncate text-sm text-white">{{ offer.provider }}</span>
        <span
          class="shrink-0 rounded-sm px-1.5 py-px text-[11px]"
          :class="offer.is_official ? 'bg-[#1d3553] text-steam-blue' : 'bg-steam-row text-steam-muted'"
        >
          {{ offer.is_official ? 'Official' : 'Keyshop' }}
        </span>
        <span v-if="cheapest" class="shrink-0 rounded-sm bg-steam-sale-bg px-1.5 py-px text-[11px] text-steam-sale">
          Cheapest
        </span>
      </div>
      <div
        v-if="offer.coupon || offer.fee > 0"
        class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-steam-muted"
      >
        <CouponCode v-if="offer.coupon" :code="offer.coupon.code" :discount="offer.coupon.discount_percentage" />
        <span v-if="offer.fee > 0">Includes {{ formatPrice(offer.fee, currency) }} fee</span>
      </div>
    </div>
    <div class="text-right">
      <div class="text-sm font-bold text-white">{{ formatPrice(offer.final_price, currency) }}</div>
      <div v-if="offer.final_price !== offer.price" class="text-[11px] text-steam-muted line-through">
        {{ formatPrice(offer.price, currency) }}
      </div>
    </div>
    <a
      :href="offer.url"
      target="_blank"
      rel="noopener sponsored"
      class="inline-flex shrink-0 items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium text-white transition-colors"
      :class="cheapest ? 'bg-kraken hover:bg-kraken-hover' : 'bg-steam-row hover:bg-kraken'"
      :aria-label="offer.coupon
        ? `Buy at ${offer.provider} for ${formatPrice(offer.final_price, currency)}. Copies code ${offer.coupon.code}`
        : `Buy at ${offer.provider} for ${formatPrice(offer.final_price, currency)}`"
      @click="copyCouponOnBuy"
    >
      Buy
      <FontAwesomeIcon icon="arrow-up-right-from-square" class="h-2.5 w-2.5" />
    </a>
  </li>
</template>
