import type { ParsedContent } from '@nuxt/content'
import type { Tag } from '@/types/Tag'

export function flatTags(postTags: Pick<ParsedContent, 'tags'>[]) {
  const tags = postTags?.map((p) => p.tags).flat().reduce((acc: Tag[], curr) => {
    const found = acc.find((tag: Tag) => tag.name === curr)
    if (found) {
      found.count += 1
    }
    else {
      acc.push({ name: curr, count: 1 })
    }
    return acc
  }, []).sort((a: Tag, b: Tag) => {
    if (a.count === b.count) {
      return a.name.localeCompare(b.name, 'zh-CN')
    }
    return b.count - a.count
  })
  return tags || []
}
