import { createSitePathResolver } from '#imports'
import { getCoverPath } from '@/utils/posts'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'
import { Feed } from 'feed'
import { getQuery, setHeader } from 'h3'

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
    copyright: `Copyright © ${author}, CC BY-NC-SA 4.0`,
    updated: new Date(),
    generator: 'HADB.ME',
    feedLinks: {
      atom: resolvePath('atom.xml'),
    },
    author: {
      name: author,
    },
  })

  const posts = await queryCollection(event, 'posts')
    .where('draft', '=', 0)
    .all()
  for (const post of posts) {
    if (post.path) {
      feed.addItem({
        id: post.path,
        title: post.title ? post.title : 'Untitled',
        link: resolvePath(post.path),
        description: post.description, // TODO: bug: 如果开头有引用，则不会输出内容
        // content: post.description, // TODO: use post HTML content
        author: [{ name: author }],
        date: new Date(post.date),
        image: post?.cover ? resolvePath(getCoverPath(post.path, post.cover)) : undefined,
      })
    }
  }

  setHeader(event, 'Content-Type', 'text/xml; charset=UTF-8')
  return feed.atom1()
})
