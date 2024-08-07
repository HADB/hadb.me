<script lang="ts" setup>
import type { ParsedContent } from '@nuxt/content'

interface Props {
  page: ParsedContent
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center flex-wrap text-sm text-slate-600 dark:text-slate-400 leading-6 divided">
    <template v-if="page?.date">
      <span>
        <time :datetime="page.date">
          {{ formatDateTime(page.date, 'yyyy 年 MM 月 dd 日') }}
        </time>
      </span>
    </template>
    <span>共 {{ page.readingTime.words }} 字</span>
    <span>约 {{ getReadingMinutes(page.readingTime.time) }} 分钟</span>
    <span><span class="artalk-pv-count">...</span> 阅读</span>
    <span><span class="artalk-comment-count">...</span> 评论</span>
    <div v-if="page.tags">
      <span>标签：</span>
      <template v-for="tag in page.tags" :key="tag">
        <NuxtLink :to="`/tags/${encodeURIComponent(tag)}`" class="!border-b-0">
          {{ tag }}
        </NuxtLink>
        <span class="mx-1 font-sans text-sm font-normal leading-normal pointer-events-none select-none text-slate-400 dark:text-slate-600 last:hidden">/</span>
      </template>
    </div>
  </div>
</template>
