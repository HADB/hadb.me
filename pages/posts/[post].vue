<script setup lang="ts">
const route = useRoute()
const { data: post } = await useAsyncData(route.path, () => {
  return queryCollection('posts').path(route.path).first()
})

// 注意：以下 301 跳转只在 SSR 时生效
if (!post.value) {
  // Page not found, set correct status code on SSR
  if (import.meta.server) {
    const event = useRequestEvent()
    if (event) {
      event.node.res.statusCode = 404
    }
  }
}

useHead({
  title: post.value?.title || 'HADB.ME',
  titleTemplate: (title) => {
    return seoTitle(title)
  },
  meta: [{
    property: 'og:title',
    content: seoTitle(post.value?.title || 'HADB.ME'),
  }],
})
</script>

<template>
  <NuxtLayout name="post">
    <ContentRenderer v-if="post" :value="post" />
    <ErrorPageNotFound v-else />
  </NuxtLayout>
</template>
