export default async function () {
  const route = useRoute()

  const { data } = await useAsyncData(`post-${route.path}`, () => {
    return queryCollection('posts').path(route.path).first()
  })

  return data
}
