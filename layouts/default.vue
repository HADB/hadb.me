<script setup lang="ts">
const { page } = useContent()
</script>

<template>
  <div class="px-4 sm:px-8">
    <div class="max-w-7xl px-4 sm:px-8 py-10 m-auto bg-white dark:bg-slate-800 shadow rounded-lg ring-1 ring-slate-200 dark:ring-slate-700">
      <main class="max-w-none prose dark:prose-invert">
        <h1 v-if="page.title">
          {{ page.title }}
        </h1>
        <PostInfo v-if="page._dir === 'posts'" :page="page" />
        <slot />
      </main>
    </div>
  </div>
</template>
