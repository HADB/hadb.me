<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('pages').path(route.path).first()
})

// 注意：以下 301 跳转只在 SSR 时生效
if (!page.value) {
  // 支持将旧的带日期的路径 301 跳转至 /posts/ 下
  if (route.path.match(/^\/\d{4}\/\d{2}\/\d{2}\/(.+)$/)) {
    navigateTo(`/posts/${route.params.slug[3]}`, { redirectCode: 301 })
  }

  // Page not found, set correct status code on SSR
  if (import.meta.server) {
    const event = useRequestEvent()
    if (event) {
      event.node.res.statusCode = 404
    }
  }
}

useHead({
  title: page.value?.title || 'HADB.ME',
  titleTemplate: (title) => {
    return seoTitle(title)
  },
  meta: [{
    property: 'og:title',
    content: seoTitle(page.value?.title || 'HADB.ME'),
  }],
})
</script>

<template>
  <NuxtLayout name="page">
    <ContentRenderer v-if="page" :value="page" />
    <ErrorPageNotFound v-else />
  </NuxtLayout>
</template>
