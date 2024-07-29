<script setup lang="ts">
const { page } = useContent()
</script>

<template>
  <div class="px-4 md:px-8">
    <div class="max-w-7xl px-4 py-10 m-auto bg-white sm:px-8 sm:shadow dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 sm:rounded-lg">
      <main class="max-w-none prose dark:prose-invert">
        <h1 v-if="page.title">
          {{ page.title }}
        </h1>
        <PostInfo :page="page" />
        <slot />
      </main>
    </div>
  </div>
</template>
