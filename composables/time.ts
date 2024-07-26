export function getReadingMinutes(milliseconds: number) {
  return Math.ceil(milliseconds / 1000 / 60)
}
