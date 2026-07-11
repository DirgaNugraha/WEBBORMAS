const ID_LOCALE = 'id-ID';

const MONTHS_SHORT: Record<string, string> = {};

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(ID_LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(ID_LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getDayNumber(dateStr: string): string {
  return String(new Date(dateStr).getDate());
}

export function getMonthShort(dateStr: string): string {
  const date = new Date(dateStr);
  const key = `${date.getMonth()}-${date.getFullYear()}`;
  if (!MONTHS_SHORT[key]) {
    MONTHS_SHORT[key] = date
      .toLocaleDateString(ID_LOCALE, { month: 'short' })
      .replace('.', '');
  }
  return MONTHS_SHORT[key];
}

export function formatNumber(n: number): string {
  return n.toLocaleString(ID_LOCALE);
}
