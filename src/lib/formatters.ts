import { format } from 'date-fns';

export function formatCurrencyDZD(amount: number): string {
  return new Intl.NumberFormat('fr-DZ', { // Using French locale for Algeria as a common representation
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('DZD', '').trim() + ' DZD';
}

export function formatDate(date: string | Date, dateFormat: string = 'PPpp'): string {
  return format(new Date(date), dateFormat);
}
