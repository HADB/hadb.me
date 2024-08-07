<script setup lang="ts">
const { page } = useContent()

useHead({
  titleTemplate: (title) => {
    return seoTitle(title)
  },
  meta: [{
    property: 'og:title',
    content: seoTitle(page.value.title),
  }],
})
</script>

<template>
  <div class="py-4 sm:py-12">
    <div class="p-4 sm:p-12 m-auto bg-white dark:bg-slate-800 outline outline-1 outline-slate-200 dark:outline-slate-700">
      <main class="max-w-7xl mx-auto prose prose-slate dark:prose-invert">
        <h1 v-if="page.title">
          {{ page.title }}
        </h1>
        <slot />
        <TextHr :class="{ hidden: page.hideComments }">
          评论区
        </TextHr>
        <Artalk :path="page._path" :title="page.title" :class="{ hidden: page.hideComments }" />
      </main>
    </div>
  </div>
</template>
