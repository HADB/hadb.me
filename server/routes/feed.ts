import { Feed } from 'feed'
import { getQuery, setHeader } from 'h3'
import { getCoverPath } from '@/utils/posts'
import { serverQueryContent } from '#content/server'
import { createSitePathResolver } from '#imports'

export default defineEventHandler(async (event) => {
  const canonicalQuery = getQuery(event).canonical
  const isShowingCanonical = typeof canonicalQuery !== 'undefined' && canonicalQuery !== 'false'

  const resolvePath = createSitePathResolver(event, {
    canonical: isShowingCanonical || !import.meta.dev,
    absolute: true,
    withBase: true,
  })

  const author = 'Bean'
  const feed = new Feed({
    title: 'HADB.ME',
    description: 'Bean 的个人网站',
    id: resolvePath(''),
    link: resolvePath(''),
    language: 'zh-CN',
    image: resolvePath('favicon/favicon-1024x1024.png'),
    favicon: resolvePath('favicon/favicon-32x32.png'),
    copyright: `Copyright © 2012-${new Date().getFullYear()}, ${author}, CC BY-NC-SA 4.0`,
    updated: new Date(),
    generator: 'HADB.ME',
    feedLinks: {
      atom: resolvePath('feed'),
    },
    author: {
      name: author,
    },
  })

  const posts = await serverQueryContent(event).where({ _path: /^\/posts/, date: { $exists: true } }).find()
  posts.forEach(async (post) => {
    if (post._path) {
      feed.addItem({
        id: post._path,
        title: post.title ? post.title : 'Untitled',
        link: resolvePath(post._path),
        description: post.description, // TODO: bug: 如果开头有引用，则不会输出内容
        // content: post.description, // TODO: use post HTML content
        author: [{ name: author }],
        date: new Date(post.date),
        image: post?.cover ? resolvePath(getCoverPath(post._path, post.cover)) : undefined,
      })
    }
  })

  setHeader(event, 'Content-Type', 'text/xml; charset=UTF-8')
  return feed.atom1()
})
