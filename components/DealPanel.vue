<script setup lang="ts">
import { computed } from 'vue';
import { verdictText } from '@/utils/format';
import { FontAwesomeIcon } from '@/utils/icons';
import { CURRENCIES, CURRENCY_SYMBOLS, currencySetting, type Currency } from '@/utils/settings';
import { useDeal } from '@/utils/useDeal';
import OfferRow from './OfferRow.vue';
import PriceHistory from './PriceHistory.vue';

const { state, offers, best, verdict, setOfficialOnly } = useDeal();

const currency = computed(() => state.deal?.currency ?? 'GBP');

const verdictLine = computed(() =>
  verdict.value && best.value ? verdictText(verdict.value, best.value.final_price, currency.value) : null,
);

const filters = [
  { label: 'All stores', officialOnly: false },
  { label: 'Official only', officialOnly: true },
];

function changeCurrency(event: Event) {
  currencySetting.setValue((event.target as HTMLSelectElement).value as Currency);
}
</script>

<template>
  <div v-if="state.deal" class="border-t border-steam-line px-4 pb-4 pt-3 [color-scheme:dark]">
    <p v-if="verdictLine" class="mb-3 flex items-start gap-2 text-[13px] text-steam-text">
      <FontAwesomeIcon
        :icon="verdict?.state === 'good' ? 'circle-check' : 'circle-info'"
        class="mt-0.5 h-3.5 w-3.5 shrink-0"
        :class="verdict?.state === 'good' ? 'text-steam-sale' : 'text-steam-muted'"
      />
      {{ verdictLine }}
    </p>

    <div class="flex flex-wrap items-center justify-between gap-2">
      <div role="radiogroup" aria-label="Which stores to show" class="inline-flex rounded bg-steam-bg p-0.5">
        <button
          v-for="filter in filters"
          :key="filter.label"
          type="button"
          role="radio"
          :aria-checked="state.officialOnly === filter.officialOnly"
          class="rounded px-3 py-1 text-xs transition-colors"
          :class="state.officialOnly === filter.officialOnly ? 'bg-kraken text-white' : 'text-steam-muted hover:text-white'"
          @click="setOfficialOnly(filter.officialOnly)"
        >
          {{ filter.label }}
        </button>
      </div>
      <div>
        <label class="sr-only" for="kk-currency">Currency</label>
        <select
          id="kk-currency"
          :value="state.deal.currency"
          class="rounded border border-steam-line bg-steam-bg px-2 py-1 text-xs text-steam-text focus:border-kraken focus:outline-none"
          @change="changeCurrency"
        >
          <option v-for="code in CURRENCIES" :key="code" :value="code">{{ CURRENCY_SYMBOLS[code] }} {{ code }}</option>
        </select>
      </div>
    </div>

    <ul v-if="offers.length" class="mt-3 space-y-0.5">
      <OfferRow
        v-for="(offer, index) in offers"
        :key="offer.provider"
        :offer="offer"
        :currency="currency"
        :cheapest="index === 0 && offers.length > 1"
      />
    </ul>
    <p v-else class="mt-4 text-[13px] text-steam-muted">
      No official stores have it in {{ currency }} right now.
    </p>

    <PriceHistory />

    <div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-steam-row pt-3 text-[13px]">
      <a :href="state.deal.krakenkeys_url" target="_blank" rel="noopener" class="text-steam-blue hover:text-white">
        More on KrakenKeys
      </a>
      <a
        :href="state.deal.krakenkeys_url"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-1.5 text-steam-blue hover:text-white"
      >
        <FontAwesomeIcon icon="bell" class="h-3 w-3" />
        Create a price alert
      </a>
    </div>
  </div>
</template>
