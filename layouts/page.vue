<script setup lang="ts">
const { page } = useContent()
</script>

<template>
  <div class="max-w-7xl px-4 md:px-8 py-10 m-auto bg-white sm:shadow dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 sm:rounded-lg">
    <main class="max-w-none prose dark:prose-invert prose-pre:bg-gray-100">
      <h1 v-if="page.title">
        {{ page.title }}
      </h1>
      <slot />
    </main>
  </div>
</template>
