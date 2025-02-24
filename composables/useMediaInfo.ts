export default async function (id: string) {
  const { data } = await useAsyncData(`mediaInfo-${id}`, () => {
    return fetch(`https://media.hadb.me/api/v1/media/${id}`)
      .then((res) => res.json())
  })
  return data
}
