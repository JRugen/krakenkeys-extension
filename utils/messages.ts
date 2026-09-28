import type { Deal } from './api';

export interface GetDealMessage {
  type: 'getDeal';
  steamAppId: number;
}

export type GetDealResponse = { ok: true; deal: Deal | null } | { ok: false };

/** Asks the background worker for a deal, so content scripts never call the API directly. */
export function requestDeal(steamAppId: number): Promise<GetDealResponse> {
  const message: GetDealMessage = { type: 'getDeal', steamAppId };

  return browser.runtime.sendMessage(message);
}
