import type { Tag } from '@/types/Tag'
import { flatTags } from '@/utils/tags'

export default defineSitemapEventHandler(async (e) => {
  const postTags = await queryCollection(e, 'posts')
    .where('draft', '=', 0)
    .where('tags', 'IS NOT NULL')
    .select('tags')
    .all()
  const tags = flatTags(postTags)

  return tags.map((tag: Tag) => {
    return asSitemapUrl({
      loc: `/tags/${encodeURIComponent(tag.name)}`,
    })
  })
})
