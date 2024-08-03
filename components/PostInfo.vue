<script lang="ts" setup>
defineProps({
  page: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="flex items-center flex-wrap text-sm text-slate-600 dark:text-slate-400 leading-6">
    <template v-if="page?.date">
      <span>
        <time :datetime="page.date">
          {{ formatDateTime(page.date, 'yyyy 年 MM 月 dd 日') }}
        </time>
      </span>
      <span class="divider">|</span>
    </template>
    <span>共 {{ page.readingTime.words }} 字</span>
    <span class="divider">|</span>
    <span>约 {{ getReadingMinutes(page.readingTime.time) }} 分钟</span>
    <template v-if="page.tags">
      <span class="divider">|</span>
      <span>标签：</span>
      <template v-for="tag in page.tags" :key="tag">
        <NuxtLink :to="`/tags/${encodeURIComponent(tag)}`" class="!border-b-0">
          {{ tag }}
        </NuxtLink>
        <span class="divider mx-1 last:hidden">/</span>
      </template>
    </template>
  </div>
</template>
