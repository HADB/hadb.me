<script lang="ts" setup>
const route = useRoute()
const tag = decodeURIComponent(route.params.tag as string)

useHead({
  title: tag,
  titleTemplate: (title) => {
    return seoTitle(title)
  },
  meta: [{
    property: 'og:title',
    content: seoTitle(tag),
  }],
})
</script>

<template>
  <NuxtLayout>
    <h1>「{{ tag }}」相关文章</h1>
    <PostList :tag="tag" />
  </NuxtLayout>
</template>
