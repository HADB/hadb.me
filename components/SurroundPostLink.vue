<script lang="ts" setup>
import type { ContentNavigationItem } from '@nuxt/content'

interface Props {
  post?: ContentNavigationItem
  type: 'prev' | 'next'
}

defineProps<Props>()
</script>

<template>
  <NuxtLink v-if="post?.path.startsWith('/posts/')" :to="post.path" class="block px-6 py-8 border not-prose rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-200/30 dark:hover:bg-slate-700/30 group" :class="{ 'text-right': type === 'prev' }">
    <div class="inline-flex items-center rounded-full p-1.5 bg-slate-50 dark:bg-slate-800 group-hover:bg-primary-500/10 ring-1 ring-slate-200 dark:ring-slate-700 mb-4 group-hover:ring-primary-500/50">
      <Icon :name="type === 'next' ? 'heroicons-arrow-left-20-solid' : 'heroicons-arrow-right-20-solid'" class="w-5 h-5 text-slate-900 dark:text-white group-hover:text-primary-500" />
    </div>
    <p class="font-medium text-slate-900 dark:text-white text-[15px]">
      {{ post.title }}
    </p>
    <p class="text-sm text-slate-500 leading-10">
      {{ formatDateTime(post.date, 'yyyy-MM-dd') }}
    </p>
    <p class="text-sm font-normal text-slate-500 dark:text-slate-400 line-clamp-2">
      {{ post.description }}
    </p>
  </NuxtLink>
  <div v-else class="px-6 py-8 border not-prose rounded-lg border-slate-200 dark:border-slate-700 hidden sm:flex items-center justify-center select-none">
    <p class="text-slate-500 dark:text-slate-400 text-[15px]">
      没有{{ type === 'prev' ? '更早' : '更新' }}的文章了
    </p>
  </div>
</template>
