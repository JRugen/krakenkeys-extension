<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import KrakenLogo from '@/components/KrakenLogo.vue';
import { API_BASE } from '@/utils/api';
import { FontAwesomeIcon } from '@/utils/icons';
import {
  CURRENCIES,
  CURRENCY_SYMBOLS,
  currencySetting,
  headerChipSetting,
  keyshopsSetting,
  type Currency,
} from '@/utils/settings';

const version = browser.runtime.getManifest().version;

const currency = ref<Currency>('GBP');
const keyshops = ref(true);
const headerChip = ref(true);
const loaded = ref(false);

onMounted(async () => {
  currency.value = await currencySetting.getValue();
  keyshops.value = await keyshopsSetting.getValue();
  headerChip.value = await headerChipSetting.getValue();
  loaded.value = true;
});

watch(currency, (value) => loaded.value && currencySetting.setValue(value));
watch(keyshops, (value) => loaded.value && keyshopsSetting.setValue(value));
watch(headerChip, (value) => loaded.value && headerChipSetting.setValue(value));

const toggles = [
  { id: 'keyshops', model: keyshops, label: 'Include keyshops', hint: 'Usually cheaper, not sold by the publisher' },
  { id: 'header-chip', model: headerChip, label: 'Price in the game header', hint: 'A shortcut next to the reviews' },
];
</script>

<template>
  <main class="w-80 bg-[#171d25] font-steam text-sm text-steam-text [color-scheme:dark]">
    <header class="px-4 pb-4 pt-5">
      <div class="flex items-center gap-3">
        <KrakenLogo class="h-10 w-10 shrink-0 text-kraken" />
        <div class="min-w-0 flex-1">
          <h1 class="text-base font-bold leading-tight text-white">KrakenKeys</h1>
          <p class="text-xs text-steam-muted">Find the best deals for Steam games</p>
        </div>
        <a
          :href="API_BASE"
          target="_blank"
          rel="noopener"
          class="grid h-8 w-8 place-items-center rounded-md text-steam-muted transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Open KrakenKeys"
        >
          <FontAwesomeIcon icon="arrow-up-right-from-square" class="h-3.5 w-3.5" />
        </a>
      </div>
    </header>

    <div class="space-y-4 px-4 pb-4">
      <section>
        <h2 class="mb-1.5 px-1 text-[11px] font-medium text-steam-muted">Settings</h2>
        <div class="divide-y divide-white/5 rounded-lg bg-steam-panel ring-1 ring-white/5">
          <label class="flex items-center justify-between gap-3 px-3 py-2.5">
            <span class="text-white">Currency</span>
            <span class="relative">
              <select
                v-model="currency"
                class="cursor-pointer appearance-none rounded-md bg-white/5 py-1 pl-2.5 pr-7 text-[13px] text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-kraken"
              >
                <option v-for="code in CURRENCIES" :key="code" :value="code">{{ CURRENCY_SYMBOLS[code] }} {{ code }}</option>
              </select>
              <FontAwesomeIcon icon="chevron-down" class="pointer-events-none absolute right-2.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 text-steam-muted" />
            </span>
          </label>
        </div>
      </section>

      <section>
        <h2 class="mb-1.5 px-1 text-[11px] font-medium text-steam-muted">Preferences</h2>
        <div class="divide-y divide-white/5 rounded-lg bg-steam-panel ring-1 ring-white/5">
          <label
            v-for="toggle in toggles"
            :key="toggle.id"
            class="flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5"
          >
            <span class="min-w-0">
              <span class="block text-white">{{ toggle.label }}</span>
              <span class="block text-xs text-steam-muted">{{ toggle.hint }}</span>
            </span>
            <input v-model="toggle.model.value" type="checkbox" class="peer sr-only" />
            <span
              class="relative h-5 w-9 shrink-0 rounded-full bg-white/10 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-kraken peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-kraken peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-steam-panel motion-reduce:transition-none motion-reduce:after:transition-none"
              aria-hidden="true"
            />
          </label>
        </div>
      </section>
    </div>

    <footer class="flex items-center justify-between border-t border-white/5 px-4 py-2.5 text-xs text-steam-muted">
      <span>v{{ version }}</span>
      <a :href="API_BASE" target="_blank" rel="noopener" class="font-medium text-kraken-text transition-colors hover:text-white">
        krakenkeys.com
      </a>
    </footer>
  </main>
</template>
