export default defineSitemapEventHandler(async (e) => {
  const posts = await queryCollection(e, 'posts').all()

  return posts.map((post) => {
    return asSitemapUrl({
      loc: post.path,
    })
  })
})
