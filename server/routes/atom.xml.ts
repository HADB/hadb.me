import process from 'node:process'
import { Feed } from 'feed'
import { setHeader } from 'h3'
import { getCoverPath } from '@/utils/posts'
import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  console.log(event)
  const siteConfig = useSiteConfig(event)
  console.log(siteConfig)
  console.log(process.env)
  const baseUrl = process.env.NODE_ENV === 'production' ? siteConfig.url : event.context.siteConfigNitroOrigin
  const author = 'Bean'
  const feed = new Feed({
    title: 'HADB.ME',
    description: 'Bean 的个人网站',
    id: baseUrl,
    link: baseUrl,
    language: 'zh-CN',
    image: new URL('favicon.svg', baseUrl).toString(),
    favicon: new URL('favicon.svg', baseUrl).toString(),
    copyright: `Copyright © 2012-${new Date().getFullYear()}, ${author}, CC BY-NC-SA 4.0`,
    updated: new Date(),
    feedLinks: {
      rss: new URL('rss', baseUrl).toString(),
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
        link: new URL(post._path, baseUrl).toString(),
        description: post.description, // TODO: bug: 如果开头有引用，则不会输出内容
        content: post.description, // TODO: use post HTML content
        author: [{ name: author }],
        date: new Date(post.date),
        image: post?.cover ? new URL(getCoverPath(post._path, post.cover), baseUrl).toString() : undefined,
      })
    }
  })

  setHeader(event, 'Content-Type', 'text/xml; charset=UTF-8')
  return feed.atom1()
})
