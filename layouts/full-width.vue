<script setup lang="ts">
const { page } = useContent()
</script>

<template>
  <div class="py-4 sm:py-12">
    <div class="p-4 sm:p-12 m-auto bg-white dark:bg-slate-800 outline outline-1 outline-slate-200 dark:outline-slate-700">
      <main class="max-w-7xl mx-auto prose dark:prose-invert">
        <h1 v-if="page.title">
          {{ page.title }}
        </h1>
        <slot />
      </main>
    </div>
  </div>
</template>
