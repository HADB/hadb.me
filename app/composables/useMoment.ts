export default async function () {
  const route = useRoute()

  const { data } = await useAsyncData(`moment-${route.path}`, () => {
    return queryCollection('moments').path(route.path).first()
  })

  return data
}
