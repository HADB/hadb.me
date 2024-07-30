<script setup lang="ts">
const { page } = useContent()
useHead({
  titleTemplate: (title) => {
    return title ? `${title} | HADB.ME` : 'HADB.ME'
  },
})
</script>

<template>
  <div class="px-4 sm:px-8">
    <div class="max-w-7xl px-4 sm:px-8 py-10 m-auto bg-white dark:bg-slate-800 rounded-lg outline outline-1 outline-slate-200 dark:outline-slate-700">
      <main class="max-w-none prose dark:prose-invert">
        <h1 v-if="page?.title">
          {{ page.title }}
        </h1>
        <PostInfo v-if="page?._dir === 'posts'" :page="page" />
        <slot />
      </main>
    </div>
  </div>
</template>
