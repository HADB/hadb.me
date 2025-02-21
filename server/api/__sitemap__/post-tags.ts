import type { Tag } from '@/types/Tag'
import { encodeTag, flatTags } from '@/utils/tags'

export default defineSitemapEventHandler(async (e) => {
  const postTags = await queryCollection(e, 'posts')
    .where('draft', '=', false)
    .where('tags', 'IS NOT NULL')
    .select('tags')
    .all()
  const tags = flatTags(postTags)

  return tags.map((tag: Tag) => {
    return asSitemapUrl({
      loc: `/posts/tag/${encodeTag(tag.name)}`,
    })
  })
})
