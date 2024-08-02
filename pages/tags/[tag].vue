<script lang="ts" setup>
const route = useRoute()
const tag = route.params.tag as string

definePageMeta({
  documentDriven: false,
})

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
  <NuxtLayout name="tag">
    <h1>{{ tag }}</h1>
    <PostList :tag="tag" />
  </NuxtLayout>
</template>
