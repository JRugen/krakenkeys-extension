import type { Currency } from './settings';

export const API_BASE = import.meta.env.WXT_API_BASE ?? 'https://krakenkeys.com';

export interface Offer {
  provider: string;
  is_official: boolean;
  price: number;
  fee: number;
  coupon: { code: string; discount_percentage: number } | null;
  final_price: number;
  url: string;
}

export interface LowestEver {
  price: number;
  date: string | null;
  provider: string | null;
  is_now: boolean;
}

export interface Verdict {
  state: 'good' | 'fair';
  reason: 'near_low' | 'beats_sale' | 'sale_drop' | 'cheaper_before';
  current: number;
  low_12m: number;
  last_sale: { name: string; low: number } | null;
  next_sale: { name: string; starts_on: string; starts_label: string } | null;
}

export interface HistoryPoint {
  date: string;
  all: number | null;
  official: number | null;
}

export interface Deal {
  steam_app_id: number;
  currency: Currency;
  location: string;
  game: { name: string; slug: string };
  krakenkeys_url: string;
  steam: { price: number; url: string } | null;
  offers: Offer[];
  offer_count: { all: number; official: number };
  lowest_ever: { all: LowestEver | null; official: LowestEver | null };
  verdict: { all: Verdict | null; official: Verdict | null };
  history: HistoryPoint[];
}

export interface DealRequest {
  steamAppId: number;
  currency: Currency;
}

/** Fetches the deal for one Steam game. Resolves to null when we have no prices for it. */
export async function fetchDeal({ steamAppId, currency }: DealRequest): Promise<Deal | null> {
  const params = new URLSearchParams({
    steam_app_id: String(steamAppId),
    currency,
  });

  const response = await fetch(`${API_BASE}/api/v1/extension/deal?${params}`, {
    credentials: 'omit',
    headers: { Accept: 'application/json' },
  });

  if (import.meta.env.DEV) {
    console.log('[KrakenKeys] API', response.status, response.url);
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`KrakenKeys API responded ${response.status}`);
  }

  const { data } = await response.json();

  return data as Deal;
}
