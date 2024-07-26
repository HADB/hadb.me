<script setup lang="ts">
const { page } = useContent()
console.log(page.value)
</script>

<template>
  <div class="max-w-2xl px-4 py-10 m-auto bg-white sm:px-8 sm:shadow dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 sm:rounded-lg">
    <main class="max-w-none prose dark:prose-invert prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-a:text-primary-400 prose-a:font-normal prose-a:no-underline hover:prose-a:border-b hover:prose-a:border-solid hover:prose-a:border-primary-400">
      <h2>{{ page.title }}</h2>
      <div class="flex items-center text-sm text-gray-500">
        <template v-if="page?.date">
          <span>
            <time :datetime="page.date">
              {{ formatDate(page.date) }}
            </time>
          </span>
          <span class="mx-2">·</span>
        </template>
        <span>共 {{ page.readingTime.words }} 字</span>
        <span class="mx-2">·</span>
        <span>约 {{ getReadingMinutes(page.readingTime.time) }} 分钟</span>
      </div>
      <slot />
    </main>
  </div>
</template>
