import { toZonedTime } from 'date-fns-tz';

export function getNowUsCentral() {
  return toZonedTime(new Date(), 'America/Chicago');
}
