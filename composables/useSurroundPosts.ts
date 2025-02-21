export default async function () {
  const route = useRoute()

  const { data } = await useAsyncData(`surroundPosts-${route.path}`, () => {
    return queryCollectionItemSurroundings('posts', route.path, { fields: ['title', 'path', 'date', 'description'] })
      .where('draft', '=', false)
      .order('date', 'DESC')
  })
  return data
}
