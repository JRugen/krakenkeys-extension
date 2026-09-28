import { describe, expect, it } from 'vitest';
import type { Verdict } from '@/utils/api';
import { formatMonth, formatPrice, verdictText } from '@/utils/format';

const verdict = (overrides: Partial<Verdict>): Verdict => ({
  state: 'fair',
  reason: 'cheaper_before',
  current: 10,
  low_12m: 8,
  last_sale: null,
  next_sale: null,
  ...overrides,
});

describe('formatPrice', () => {
  it('formats in the requested currency', () => {
    expect(formatPrice(10.5, 'GBP')).toBe('£10.50');
    expect(formatPrice(10.5, 'USD')).toBe('US$10.50');
  });
});

describe('formatMonth', () => {
  it('shows a short month and year', () => {
    expect(formatMonth('2026-02-19')).toBe('Feb 2026');
  });

  it('handles a missing date', () => {
    expect(formatMonth(null)).toBe('');
  });
});

describe('verdictText', () => {
  it('says how much cheaper it has been', () => {
    expect(verdictText(verdict({}), 10, 'GBP')).toBe("Fair price. It's been £2.00 cheaper this year.");
  });

  it('calls it good when it matches the yearly low', () => {
    expect(verdictText(verdict({ low_12m: 10 }), 10, 'GBP')).toBe('Good price. Near its lowest this year.');
  });

  it('mentions the next sale when prices usually drop', () => {
    const saleDrop = verdict({
      reason: 'sale_drop',
      last_sale: { name: 'Summer Sale', low: 6 },
      next_sale: { name: 'Autumn Sale', starts_on: '2026-10-01', starts_label: '1 Oct' },
    });

    expect(verdictText(saleDrop, 10, 'GBP')).toBe('Fair price. Autumn Sale starts 1 Oct and it hit £6.00 in the last one.');
  });
});
