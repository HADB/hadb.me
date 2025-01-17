<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('pages').path(route.path).first()
})

useHead({
  titleTemplate: (title) => {
    return seoTitle(title)
  },
  meta: [{
    property: 'og:title',
    content: seoTitle(page.value?.title),
  }],
})
</script>

<template>
  <div class="p-4 sm:p-12">
    <div class="max-w-7xl p-4 sm:p-12 m-auto bg-white dark:bg-slate-800 rounded-lg outline outline-1 outline-slate-200 dark:outline-slate-700">
      <main class="max-w-none prose prose-slate dark:prose-invert">
        <template v-if="page">
          <h1 v-if="page.title">
            {{ page.title }}
          </h1>
          <slot />
          <TextHr :class="{ hidden: page.hideComments }">
            评论区
          </TextHr>
          <Artalk :path="page.path" :title="page.title" :class="{ hidden: page.hideComments }" />
        </template>
        <slot v-else />
      </main>
    </div>
  </div>
</template>
