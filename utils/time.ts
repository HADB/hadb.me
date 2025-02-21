import { DateTime } from 'luxon'

export function formatDateTime(isoTime: string, format: string = 'yyyy-MM-dd HH:mm:ss'): string {
  return DateTime.fromISO(isoTime, { zone: 'Asia/Shanghai' })
    .setZone(DateTime.local().zoneName)
    .toFormat(format)
}

export function getReadingMinutes(milliseconds: number) {
  return Math.ceil(milliseconds / 1000 / 60)
}
