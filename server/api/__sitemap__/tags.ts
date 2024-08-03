import { serverQueryContent } from '#content/server'
import { asSitemapUrl, defineSitemapEventHandler } from '#imports'
import { flatTags } from '@/utils/tags'
import type { Tag } from '@/types/Tag'

export default defineSitemapEventHandler(async (e) => {
  const postTags = await serverQueryContent(e).where({ _path: /^\/posts/, tags: { $exists: true } }).only(['tags']).find()
  const tags = flatTags(postTags)

  return tags.map((tag: Tag) => {
    return asSitemapUrl({
      loc: `/tags/${tag.name}`,
    })
  })
})
