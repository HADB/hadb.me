import type { MinimalTree } from '@nuxt/content'
import { createSitePathResolver } from '#imports'
import { decompressTree, extractContent } from '@/utils/mdc'
import { getCoverPath } from '@/utils/posts'
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
    description: 'feedId:87047734898412544+userId:130241058717434880',
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
    .where('draft', '=', false)
    .all()
  for (const post of posts) {
    if (post.path) {
      const coverUrl = post?.cover ? resolvePath(getCoverPath(post)) : undefined
      const cover = coverUrl ? `<img src="${coverUrl}" alt="封面" />` : ''

      feed.addItem({
        id: post.path,
        title: post.title ? post.title : 'Untitled',
        link: resolvePath(post.path),
        description: post.description, // TODO: bug: 如果开头有引用，则不会输出内容
        content: cover + extractContent(decompressTree(post.body as unknown as MinimalTree, post.stem, resolvePath)),
        author: [{ name: author }],
        date: new Date(post.date),
      })
    }
  }

  setHeader(event, 'Content-Type', 'text/xml; charset=UTF-8')
  return feed.atom1()
})
