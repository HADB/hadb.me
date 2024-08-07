<script lang="ts" setup>
const route = useRoute()
const tag = decodeURIComponent(route.params.tag as string)

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
    <TextHr class="hidden">
      评论区
    </TextHr>
    <Artalk :path="`/tags/${tag}`" :title="tag" class="hidden" />
  </NuxtLayout>
</template>
