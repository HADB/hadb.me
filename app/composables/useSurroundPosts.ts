import type { ContentNavigationItem } from '@nuxt/content'

export default async function () {
  const route = useRoute()

  const { data } = await useAsyncData(`surroundPosts-${route.path}`, async () => {
    const items = await queryCollectionItemSurroundings('posts', route.path, { fields: ['title', 'path', 'date', 'description'] })
      .where('draft', '=', false)
      .order('date', 'DESC')
    return items.map((item: ContentNavigationItem): SurroundPost | null => item
      ? { path: item.path, title: String(item.title), date: String(item.date ?? ''), description: item.description ? String(item.description) : undefined }
      : null)
  })
  return data
}
