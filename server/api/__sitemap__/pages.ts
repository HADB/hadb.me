export default defineSitemapEventHandler(async (e) => {
  const pages = await queryCollection(e, 'pages').all()

  return pages.map((page) => {
    return asSitemapUrl({
      loc: page.path,
    })
  })
})
