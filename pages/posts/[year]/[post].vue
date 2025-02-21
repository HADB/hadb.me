<script setup lang="ts">
const post = await usePost()
const surroundPosts = await useSurroundPosts()
const coverPath = getCoverPath(post.value)

// 注意：以下 301 跳转只在 SSR 时生效
if (!post.value) {
  const route = useRoute()
  const postKey = route.path.replace(/^\/posts\//, '').replace(/^\/article\//, '')
  const { data: fallbackPost } = await useAsyncData(`post-fallback-${route.path}`, () => {
    return queryCollection('posts').where('path', 'LIKE', `%${postKey}`).first()
  })

  post.value = fallbackPost.value

  if (fallbackPost.value) {
    if (import.meta.server) {
      const event = useRequestEvent()
      if (event) {
        event.node.res.writeHead(301, { Location: fallbackPost.value.path })
        event.node.res.end()
      }
    }
    else {
      // Client side redirect
      navigateTo(fallbackPost.value.path)
    }
  }
  else if (import.meta.server) {
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

      <PostInfo :post="post" />
      <NuxtImg v-if="coverPath" :src="coverPath" :alt="post.title" class="w-full" :width="post.coverSize?.width || 1920" :height="post.coverSize?.height || 900" />
      <div :class="post.class">
        <ContentRenderer :value="post" />
      </div>
      <TextHr :class="{ hidden: post.hideComments }">
        评论区
      </TextHr>
      <Artalk :path="post.path" :title="post.title" :class="{ hidden: post.hideComments }" />
      <div class="grid gap-4 sm:gap-12 sm:grid-cols-2 mt-4">
        <SurroundPostLink :post="surroundPosts!![0]" type="prev" />
        <SurroundPostLink :post="surroundPosts!![1]" type="next" />
      </div>
    </template>
    <ErrorPageNotFound v-else />
  </NuxtLayout>
</template>
