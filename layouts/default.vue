<script setup lang="ts">
const { page } = useContent()

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
        <h1 v-if="page?.title">
          {{ page.title }}
        </h1>
        <PostInfo v-if="page?._dir === 'posts'" :page="page" />
        <NuxtImg v-if="page?.cover" :src="getCoverPath(page._path, page.cover)" :alt="page.title" class="w-full" :width="1920" :height="900" />
        <div :class="page?.class">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
