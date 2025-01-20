<script setup lang="ts">
const route = useRoute()
const { data: post } = await useAsyncData(route.path, () => {
  return queryCollection('posts').path(route.path).first()
})

const { data: surroundPosts } = await useAsyncData('surround', () => {
  return queryCollectionItemSurroundings('posts', route.path, { fields: ['title', 'path', 'date', 'description'] })
})

const coverPath = post.value?.cover ? getCoverPath(post.value.path, post.value.cover) : ''

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
  }, {
    property: 'description',
    content: post.value?.description,
  }, {
    property: 'og:description',
    content: post.value?.description,
  }],
})
</script>

<template>
  <NuxtLayout>
    <template v-if="post">
      <h1 v-if="post.title">
        {{ post.title }}
      </h1>

      <PostInfo :page="post" />
      <NuxtImg v-if="coverPath" :src="coverPath" :alt="post.title" class="w-full" :width="post.coverSize?.width || 1920" :height="post.coverSize?.height || 900" />
      <div :class="post.class">
        <ContentRenderer :value="post" />
      </div>
      <TextHr :class="{ hidden: post.hideComments }">
        评论区
      </TextHr>
      <Artalk :path="post.path" :title="post.title" :class="{ hidden: post.hideComments }" />
      <div class="grid gap-4 sm:gap-12 sm:grid-cols-2 mt-4">
        <SurroundPostLink :post="surroundPosts!![1]" type="next" />
        <SurroundPostLink :post="surroundPosts!![0]" type="prev" />
      </div>
    </template>
    <ErrorPageNotFound v-else />
  </NuxtLayout>
</template>
