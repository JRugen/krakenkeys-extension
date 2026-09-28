export const CURRENCIES = ['GBP', 'USD', 'EUR', 'CAD', 'AUD'] as const;

export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GBP: '£',
  USD: '$',
  EUR: '€',
  CAD: 'C$',
  AUD: 'A$',
};

export const currencySetting = storage.defineItem<Currency>('sync:currency', {
  fallback: 'GBP',
});

export const keyshopsSetting = storage.defineItem<boolean>('sync:keyshops', {
  fallback: true,
});

export const headerChipSetting = storage.defineItem<boolean>('sync:headerChip', {
  fallback: true,
});
