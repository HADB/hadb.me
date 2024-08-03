export function getCoverPath(postPath: string | undefined, coverExtension: string) {
  return `/images/${postPath}-cover.${coverExtension}`
}
