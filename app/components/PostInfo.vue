<script lang="ts" setup>
import type { PostsCollectionItem } from '@nuxt/content'

defineProps<{
  post: PostsCollectionItem
}>()
</script>

<template>
  <div class="flex items-center flex-wrap text-sm text-slate-600 dark:text-slate-400 py-3 leading-10 divided border-t border-b border-slate-200 dark:border-slate-700">
    <div v-if="post.date" class="flex items-center">
      <UIcon name="uil:calendar-alt" class="w-4 h-4 mr-1" />
      <time :datetime="post.date">
        {{ formatDateTime(post.date, 'yyyy 年 MM 月 dd 日') }}
      </time>
      <span v-if="post.time" class="ml-1">{{ post.time }}</span>
    </div>
    <div class="flex items-center">
      <UIcon name="uil:font" class="w-4 h-4 mr-1" />
      <span>{{ post.readingTime?.words }} 字</span>
    </div>
    <div class="flex items-center">
      <UIcon name="uil:clock" class="w-4 h-4 mr-1" />
      <span>{{ getReadingMinutes(post.readingTime?.time) }} 分钟</span>
    </div>
    <div class="flex items-center">
      <UIcon name="uil:eye" class="w-4 h-4 mr-1" />
      <span class="artalk-pv-count" :data-page-key="post.path">...</span>
      <span class="ml-1">阅读</span>
    </div>
    <div class="flex items-center">
      <UIcon name="uil:comment-alt-lines" class="w-4 h-4 mr-1" />
      <span class="artalk-comment-count" :data-page-key="post.path">...</span>
      <span class="ml-1">评论</span>
    </div>
    <div v-if="post.weather" class="flex items-center">
      <UIcon name="uil:cloud-sun" class="w-4 h-4 mr-1" />
      <span>{{ post.weather }}</span>
    </div>
    <div v-if="post.location" class="flex items-center">
      <UIcon name="uil:map-marker" class="w-4 h-4 mr-1" />
      <span>{{ post.location }}</span>
    </div>
    <div v-if="post.tags" class="flex items-center">
      <UIcon name="uil:tag-alt" class="w-4 h-4 mr-1" />
      <template v-for="tag in post.tags" :key="tag">
        <NuxtLink :to="`/posts/tag/${encodeTag(tag)}`" class="border-b-0!">
          {{ tag }}
        </NuxtLink>
        <span class="mx-1 font-sans text-sm font-normal leading-normal pointer-events-none select-none text-slate-400 dark:text-slate-600 last:hidden">/</span>
      </template>
    </div>
  </div>
</template>
