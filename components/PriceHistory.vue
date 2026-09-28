<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatMonth, formatPrice } from '@/utils/format';
import { useDeal } from '@/utils/useDeal';

const WIDTH = 560;
const HEIGHT = 96;
const PAD_TOP = 18;
const PAD_BOTTOM = 8;

const { state, steamPrice, lowestEver } = useDeal();

const active = ref<number | null>(null);

const points = computed(() => {
  const key = state.officialOnly ? 'official' : 'all';

  return (state.deal?.history ?? [])
    .map((point) => ({ date: point.date, price: point[key] }))
    .filter((point): point is { date: string; price: number } => point.price !== null && point.price > 0);
});

const currency = computed(() => state.deal?.currency ?? 'GBP');

const scale = computed(() => {
  const prices = points.value.map((point) => point.price);

  if (steamPrice.value !== null) {
    prices.push(steamPrice.value);
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return { min, span: max - min || 1 };
});

const x = (index: number) => (index / Math.max(points.value.length - 1, 1)) * WIDTH;
const y = (price: number) => PAD_TOP + (1 - (price - scale.value.min) / scale.value.span) * (HEIGHT - PAD_TOP - PAD_BOTTOM);
const pct = (value: number, total: number) => `${(value / total) * 100}%`;

const line = computed(() =>
  points.value.map((point, index) => `${index ? 'L' : 'M'}${x(index).toFixed(1)},${y(point.price).toFixed(1)}`).join(''),
);

const area = computed(() =>
  points.value.length ? `${line.value}L${WIDTH},${HEIGHT}L0,${HEIGHT}Z` : '',
);

const lowest = computed(() =>
  points.value.reduce<{ index: number; price: number } | null>(
    (low, point, index) => (!low || point.price < low.price ? { index, price: point.price } : low),
    null,
  ),
);

const activePoint = computed(() => (active.value === null ? null : points.value[active.value] ?? null));

const formatDay = (date: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(date));

const firstDate = computed(() => points.value[0]?.date ?? null);

const lastDate = computed(() => points.value.at(-1)?.date ?? null);

const summary = computed(() => {
  const low = lowest.value ? formatPrice(lowest.value.price, currency.value) : '';
  const latest = points.value.at(-1);

  return `Price over the last ${points.value.length} days. Lowest ${low}${latest ? `, today ${formatPrice(latest.price, currency.value)}` : ''}. Use the arrow keys to read each day.`;
});

function pointFromEvent(event: PointerEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);

  active.value = Math.round(ratio * (points.value.length - 1));
}

function onKey(event: KeyboardEvent) {
  const last = points.value.length - 1;
  const current = active.value ?? last;
  const moves: Record<string, number> = {
    ArrowLeft: Math.max(current - 1, 0),
    ArrowRight: Math.min(current + 1, last),
    Home: 0,
    End: last,
  };

  if (event.key in moves) {
    event.preventDefault();
    active.value = moves[event.key] ?? current;
  }
}
</script>

<template>
  <div v-if="points.length > 1" class="mt-4">
    <div class="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs text-steam-muted">
      <span>Price history</span>
      <span v-if="lowestEver">
        Lowest ever: <span class="text-steam-text">{{ formatPrice(lowestEver.price, currency) }}</span>
        <template v-if="lowestEver.provider"> at {{ lowestEver.provider }}</template>
        <template v-if="lowestEver.date"> ({{ formatMonth(lowestEver.date) }})</template>
      </span>
    </div>

    <div
      class="relative touch-none rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-kraken"
      tabindex="0"
      role="img"
      :aria-label="summary"
      @pointermove="pointFromEvent"
      @pointerdown="pointFromEvent"
      @pointerleave="active = null"
      @keydown="onKey"
      @blur="active = null"
    >
      <svg :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" class="block h-24 w-full overflow-visible" preserveAspectRatio="none" aria-hidden="true">
        <line
          v-if="steamPrice !== null"
          x1="0"
          :x2="WIDTH"
          :y1="y(steamPrice)"
          :y2="y(steamPrice)"
          stroke="#8f98a0"
          stroke-dasharray="4 4"
          vector-effect="non-scaling-stroke"
        />
        <path :d="area" fill="#7f2aff" fill-opacity="0.15" />
        <path :d="line" fill="none" stroke="#9150ff" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
        <line
          v-if="activePoint && active !== null"
          :x1="x(active)"
          :x2="x(active)"
          :y1="0"
          :y2="HEIGHT"
          stroke="#c6d4df"
          stroke-opacity="0.4"
          vector-effect="non-scaling-stroke"
        />
      </svg>

      <span
        v-if="steamPrice !== null"
        class="pointer-events-none absolute right-0 -translate-y-full pb-0.5 text-[11px] text-steam-muted"
        :style="{ top: pct(y(steamPrice), HEIGHT) }"
      >
        Steam {{ formatPrice(steamPrice, currency) }}
      </span>

      <template v-if="lowest">
        <span
          class="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-steam-sale ring-2 ring-steam-panel"
          :style="{ left: pct(x(lowest.index), WIDTH), top: pct(y(lowest.price), HEIGHT) }"
        />
        <span
          v-if="!activePoint"
          class="pointer-events-none absolute -translate-y-full whitespace-nowrap pb-1.5 text-[11px] text-steam-sale"
          :class="lowest.index > points.length / 2 ? '-translate-x-full' : ''"
          :style="{ left: pct(x(lowest.index), WIDTH), top: pct(y(lowest.price), HEIGHT) }"
        >
          Low {{ formatPrice(lowest.price, currency) }}
        </span>
      </template>

      <template v-if="activePoint && active !== null">
        <span
          class="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-2 ring-kraken"
          :style="{ left: pct(x(active), WIDTH), top: pct(y(activePoint.price), HEIGHT) }"
        />
        <span
          class="pointer-events-none absolute top-0 z-10 -translate-y-[110%] whitespace-nowrap rounded bg-steam-bg px-2 py-1 text-xs text-steam-text shadow-lg ring-1 ring-steam-line"
          :class="active > points.length * 0.8 ? '-translate-x-full' : active < points.length * 0.2 ? '' : '-translate-x-1/2'"
          :style="{ left: pct(x(active), WIDTH) }"
        >
          {{ formatDay(activePoint.date) }}
          <span class="ml-1 font-bold text-white">{{ formatPrice(activePoint.price, currency) }}</span>
        </span>
      </template>
    </div>

    <span class="sr-only" aria-live="polite">
      {{ activePoint ? `${formatDay(activePoint.date)}, ${formatPrice(activePoint.price, currency)}` : '' }}
    </span>

    <div class="mt-1.5 flex justify-between text-[11px] text-steam-muted">
      <span v-if="firstDate">{{ formatDay(firstDate) }}</span>
      <span v-if="lastDate">{{ formatDay(lastDate) }}</span>
    </div>
  </div>
</template>
