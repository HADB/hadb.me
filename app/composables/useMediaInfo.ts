export default async function (id: string) {
  const { data } = await useAsyncData(`mediaInfo-${id}`, () => {
    return fetch(`https://peertube.hadb.me/api/v1/videos/${id}`)
      .then((res) => res.json())
  })
  return data
}
