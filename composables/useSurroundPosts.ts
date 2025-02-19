export default async function () {
  const route = useRoute()

  const { data } = await useAsyncData(`surroundPosts-${route.path}`, () => {
    return queryCollectionItemSurroundings('posts', route.path, { fields: ['title', 'path', 'date', 'description'] })
      .where('draft', '=', 0)
      .order('date', 'DESC')
  })
  return data
}
