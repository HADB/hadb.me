import type { PostsCollectionItem } from '@nuxt/content'

export function getCoverPath(post?: PostsCollectionItem | null) {
  if (post?.cover) {
    return `/static/${post.stem}/cover.${post.cover}`
  }
  return ''
}
