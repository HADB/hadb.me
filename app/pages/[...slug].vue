<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('pages').path(route.path).first()
})

// 注意：以下 301 跳转只在 SSR 时生效
if (!page.value) {
  // 支持将旧的带日期的路径 301 跳转至 /posts/ 下
  if (route.path.match(/^\/\d{4}\/\d{2}\/\d{2}\/(.+)$/)) {
    navigateTo(`/posts/${route.params.slug![3]}`, { redirectCode: 301 })
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
  }, {
    property: 'description',
    content: page.value?.description || '',
  }, {
    property: 'og:description',
    content: page.value?.description || '',
  }],
})
</script>

<template>
  <NuxtLayout :name="page?.layout || 'default'">
    <template v-if="page">
      <h1 v-if="page.title">
        {{ page.title }}
      </h1>
      <ContentRenderer :value="page" />
      <TextHr :class="{ hidden: page.hideComments }">
        评论区
      </TextHr>
      <Artalk :path="page.path" :title="page.title" :class="{ hidden: page.hideComments }" />
    </template>
    <ErrorPageNotFound v-else />
  </NuxtLayout>
</template>
