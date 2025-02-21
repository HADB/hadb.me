import type { Tag } from '@/types/Tag'
import { encodeTag, flatTags } from '@/utils/tags'

export default defineSitemapEventHandler(async (e) => {
  const momentTags = await queryCollection(e, 'moments')
    .where('tags', 'IS NOT NULL')
    .select('tags')
    .all()
  const tags = flatTags(momentTags)

  return tags.map((tag: Tag) => {
    return asSitemapUrl({
      loc: `/moments/tag/${encodeTag(tag.name)}`,
    })
  })
})
