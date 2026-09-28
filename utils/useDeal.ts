import { computed, reactive } from 'vue';
import type { Deal } from './api';
import { requestDeal } from './messages';
import { keyshopsSetting } from './settings';

type Status = 'loading' | 'ready' | 'empty' | 'error';

const state = reactive({
  steamAppId: 0,
  status: 'loading' as Status,
  deal: null as Deal | null,
  officialOnly: false,
  panelOpen: false,
  highlight: false,
});

const offers = computed(() =>
  (state.deal?.offers ?? []).filter((offer) => !state.officialOnly || offer.is_official),
);

const best = computed(() => offers.value[0] ?? null);

const steamPrice = computed(() => state.deal?.steam?.price ?? null);

const steamIsCheapest = computed(() => {
  if (!best.value) {
    return false;
  }

  return best.value.provider.toLowerCase() === 'steam'
    || (steamPrice.value !== null && best.value.final_price >= steamPrice.value - 0.005);
});

const saving = computed(() => {
  if (!best.value || steamPrice.value === null || steamIsCheapest.value) {
    return null;
  }

  const amount = steamPrice.value - best.value.final_price;

  return { amount, percent: Math.round((amount / steamPrice.value) * 100) };
});

const scope = computed(() => (state.officialOnly ? 'official' : 'all'));

const lowestEver = computed(() => state.deal?.lowest_ever[scope.value] ?? null);

const verdict = computed(() => state.deal?.verdict[scope.value] ?? null);

const isLowestEver = computed(() =>
  !!best.value && !!lowestEver.value && best.value.final_price <= lowestEver.value.price + 0.005,
);

const storeCount = computed(() =>
  state.deal ? state.deal.offer_count[scope.value] : 0,
);

async function load(steamAppId: number): Promise<void> {
  state.steamAppId = steamAppId;
  state.status = state.deal ? state.status : 'loading';
  state.officialOnly = !(await keyshopsSetting.getValue());

  const response = await requestDeal(steamAppId);

  if (!response.ok) {
    state.status = 'error';
    return;
  }

  state.deal = response.deal;
  state.status = response.deal ? 'ready' : 'empty';
}

function setOfficialOnly(value: boolean): void {
  state.officialOnly = value;
  keyshopsSetting.setValue(!value);
}

/** Shared deal state for the widget and header chip on the current Steam page. */
export function useDeal() {
  return {
    state,
    offers,
    best,
    steamPrice,
    steamIsCheapest,
    saving,
    lowestEver,
    verdict,
    isLowestEver,
    storeCount,
    load,
    setOfficialOnly,
  };
}
