import type { Verdict } from './api';

export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount);
}

export function formatMonth(date: string | null): string {
  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' }).format(new Date(date));
}

/** Human wording for a price verdict, matching the game page on the site. */
export function verdictText(verdict: Verdict, current: number, currency: string): string | null {
  switch (verdict.reason) {
    case 'near_low':
      return 'Good price. Near its lowest this year.';
    case 'beats_sale':
      return "Good price. Already cheaper than Steam's last sale.";
    case 'sale_drop':
      return verdict.next_sale && verdict.last_sale
        ? `Fair price. ${verdict.next_sale.name} starts ${verdict.next_sale.starts_label} and it hit ${formatPrice(verdict.last_sale.low, currency)} in the last one.`
        : null;
    case 'cheaper_before': {
      const difference = current - verdict.low_12m;

      return difference < 0.01
        ? 'Good price. Near its lowest this year.'
        : `Fair price. It's been ${formatPrice(difference, currency)} cheaper this year.`;
    }
    default:
      return null;
  }
}
