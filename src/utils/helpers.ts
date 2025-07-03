import { toZonedTime } from 'date-fns-tz';

export function getNowUsCentral() {
  return toZonedTime(new Date(), 'America/Chicago');
}

export function getUtcMidnight(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export function isoToSimpleDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('T')[0]!.split('-');
  return `${parseInt(month!)}-${parseInt(day!)}-${year}`;
}
