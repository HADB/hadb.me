<script setup lang="ts">
const { page } = useContent()
</script>

<template>
  <div class="py-10 m-auto bg-white ring-1 ring-gray-200 dark:ring-gray-700 dark:bg-gray-800">
    <main class="max-w-7xl px-4 md:px-8 mx-auto prose dark:prose-invert">
      <h1 v-if="page.title">
        {{ page.title }}
      </h1>
      <slot />
    </main>
  </div>
</template>
