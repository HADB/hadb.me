import { DateTime } from 'luxon'

export function formatDateTime(isoTime: string, format: string = 'yyyy-MM-dd HH:mm:ss'): string {
  return DateTime.fromISO(isoTime, { zone: 'Asia/Shanghai' })
    .setZone(DateTime.local().zoneName)
    .toFormat(format)
}

export function getReadingMinutes(milliseconds: number) {
  return Math.ceil(milliseconds / 1000 / 60)
}

export function getDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600) ? Math.floor(seconds / 3600).toString().padStart(2, '0') : undefined
  const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
  const restSeconds = (seconds % 60).toString().padStart(2, '0')
  return `${hours ? `${hours}:` : ''}${minutes}:${restSeconds}`
}
