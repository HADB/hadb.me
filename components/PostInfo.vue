<script lang="ts" setup>
import type { ParsedContent } from '@nuxt/content'

interface Props {
  page: ParsedContent
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center flex-wrap text-sm text-slate-600 dark:text-slate-400 py-3 leading-10 divided border-t border-b border-slate-200 dark:border-slate-700">
    <div v-if="page?.date" class="flex items-center">
      <Icon name="uil:calendar-alt" class="w-4 h-4 mr-1" />
      <time :datetime="page.date">
        {{ formatDateTime(page.date, 'yyyy 年 MM 月 dd 日') }}
      </time>
    </div>
    <div class="flex items-center">
      <Icon name="uil:font" class="w-4 h-4 mr-1" />
      <span>{{ page.readingTime.words }} 字</span>
    </div>
    <div class="flex items-center">
      <Icon name="uil:clock" class="w-4 h-4 mr-1" />
      <span>{{ getReadingMinutes(page.readingTime.time) }} 分钟</span>
    </div>
    <div class="flex items-center">
      <Icon name="uil:eye" class="w-4 h-4 mr-1" />
      <span class="artalk-pv-count">...</span>
      <span>&nbsp;阅读</span>
    </div>
    <div class="flex items-center">
      <Icon name="uil:comment-alt-lines" class="w-4 h-4 mr-1" />
      <span class="artalk-comment-count">...</span>
      <span>&nbsp;评论</span>
    </div>
    <div v-if="page.tags" class="flex items-center">
      <Icon name="uil:tag-alt" class="w-4 h-4 mr-1" />
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
