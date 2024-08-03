import { Feed } from 'feed'
import { serverQueryContent } from '#content/server'

const BASE_URL = 'https://hadb.me'
const AUTHOR_NAME = 'Bean'

export default defineEventHandler(async (event) => {
  const feed = new Feed({
    title: 'HADB.ME',
    id: BASE_URL,
    link: BASE_URL,
    language: 'zh-CN',
    // image: `${BASE_URL}/images/placeholder.png`,
    favicon: `${BASE_URL}/favicon.ico`,
    copyright: `Copyright © 2012-${new Date().getFullYear()}, ${AUTHOR_NAME}, CC BY-NC-SA 4.0`,
    updated: new Date(),
    feedLinks: {
      rss: `${BASE_URL}/rss`,
    },
    author: {
      name: AUTHOR_NAME,
    },
  })

  const posts = await serverQueryContent(event).where({ _path: /^\/posts/, date: { $exists: true } }).find()

  posts.forEach((post) => {
    feed.addItem({
      title: post.title ? post.title : 'Untitled',
      id: post._path,
      link: `${BASE_URL}${post._path}`,
      description: post.description,
      author: [{ name: AUTHOR_NAME }],
      date: new Date(post.date),
      image: post?.cover ? `${BASE_URL}/images/${post._path}-cover.${post.cover}` : undefined,
    })
  })

  return feed.rss2()
})
