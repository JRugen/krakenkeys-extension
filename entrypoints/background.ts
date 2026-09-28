import { fetchDeal, type Deal, type DealRequest } from '@/utils/api';
import type { GetDealMessage, GetDealResponse } from '@/utils/messages';
import { currencySetting } from '@/utils/settings';

const CACHE_TTL_MS = 30 * 60 * 1000;

interface CachedDeal {
  deal: Deal | null;
  cachedAt: number;
}

async function getDeal(request: DealRequest): Promise<Deal | null> {
  const key = `session:deal:${request.steamAppId}:${request.currency}` as const;
  const cached = await storage.getItem<CachedDeal>(key);

  if (!import.meta.env.DEV && cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.deal;
  }

  const deal = await fetchDeal(request);
  await storage.setItem<CachedDeal>(key, { deal, cachedAt: Date.now() });

  return deal;
}

async function handleGetDeal(message: GetDealMessage): Promise<GetDealResponse> {
  try {
    const deal = await getDeal({
      steamAppId: message.steamAppId,
      currency: await currencySetting.getValue(),
    });

    return { ok: true, deal };
  } catch (error) {
    console.error('[KrakenKeys] Deal lookup failed', message.steamAppId, error);
    return { ok: false };
  }
}

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message: GetDealMessage, _sender, sendResponse) => {
    if (message?.type !== 'getDeal') {
      return;
    }

    handleGetDeal(message).then(sendResponse);

    return true;
  });
});
