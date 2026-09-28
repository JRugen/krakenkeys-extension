import { beforeEach, describe, expect, it } from 'vitest';
import { fakeBrowser } from 'wxt/testing/fake-browser';
import type { Deal, Offer } from '@/utils/api';
import { useDeal } from '@/utils/useDeal';

const offer = (provider: string, finalPrice: number, isOfficial = false): Offer => ({
  provider,
  is_official: isOfficial,
  price: finalPrice,
  fee: 0,
  coupon: null,
  final_price: finalPrice,
  url: `https://krakenkeys.com/out/${provider}`,
});

const deal = (offers: Offer[], steamPrice: number | null = 23.49): Deal => ({
  steam_app_id: 892970,
  currency: 'GBP',
  location: 'europe',
  game: { name: 'Valheim', slug: 'valheim' },
  krakenkeys_url: 'https://krakenkeys.com/game/valheim',
  steam: steamPrice === null ? null : { price: steamPrice, url: 'https://krakenkeys.com/out/steam' },
  offers,
  offer_count: { all: offers.length, official: offers.filter((item) => item.is_official).length },
  lowest_ever: {
    all: { price: 4, date: '2026-02-19', provider: 'K4G', is_now: false },
    official: { price: 7.74, date: '2025-09-09', provider: 'Steam', is_now: false },
  },
  verdict: { all: null, official: null },
  history: [],
});

describe('useDeal', () => {
  const store = useDeal();

  beforeEach(() => {
    fakeBrowser.reset();
    store.state.officialOnly = false;
    store.state.deal = deal([offer('Loaded', 10.99), offer('Fanatical', 17.62, true), offer('Steam', 23.49, true)]);
  });

  it('picks the cheapest offer and works out the saving against Steam', () => {
    expect(store.best.value?.provider).toBe('Loaded');
    expect(store.saving.value?.amount).toBeCloseTo(12.5);
    expect(store.saving.value?.percent).toBe(53);
    expect(store.steamIsCheapest.value).toBe(false);
  });

  it('only uses official stores when asked', () => {
    store.setOfficialOnly(true);

    expect(store.best.value?.provider).toBe('Fanatical');
    expect(store.lowestEver.value?.price).toBe(7.74);
    expect(store.storeCount.value).toBe(2);
  });

  it('knows when Steam is the cheapest', () => {
    store.state.deal = deal([offer('Steam', 23.49, true), offer('Loaded', 25)]);

    expect(store.steamIsCheapest.value).toBe(true);
    expect(store.saving.value).toBeNull();
  });

  it('treats a store matching the Steam price as no saving', () => {
    store.state.deal = deal([offer('Fanatical', 23.49, true)]);

    expect(store.steamIsCheapest.value).toBe(true);
  });

  it('flags a lowest ever price', () => {
    store.state.deal = deal([offer('K4G', 4)]);

    expect(store.isLowestEver.value).toBe(true);
  });

  it('copes without a Steam price', () => {
    store.state.deal = deal([offer('Loaded', 10.99)], null);

    expect(store.saving.value).toBeNull();
    expect(store.steamIsCheapest.value).toBe(false);
  });
});
