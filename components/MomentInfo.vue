<script lang="ts" setup>
import type { MomentsCollectionItem } from '@nuxt/content'

defineProps<{
  moment: MomentsCollectionItem
}>()
</script>

<template>
  <div class="flex items-center flex-wrap text-sm text-slate-600 dark:text-slate-400 py-3 leading-10 divided border-t border-b border-slate-200 dark:border-slate-700">
    <div v-if="moment.datetime" class="flex items-center">
      <Icon name="uil:calendar-alt" class="w-4 h-4 mr-1" />
      <time :datetime="moment.datetime">
        {{ formatDateTime(moment.datetime, 'yyyy 年 MM 月 dd 日 HH:mm') }}
      </time>
    </div>
    <div class="flex items-center">
      <Icon name="uil:eye" class="w-4 h-4 mr-1" />
      <span class="artalk-pv-count" :data-page-key="moment.path">...</span>
      <span class="ml-1">阅读</span>
    </div>
    <div class="flex items-center">
      <Icon name="uil:comment-alt-lines" class="w-4 h-4 mr-1" />
      <span class="artalk-comment-count" :data-page-key="moment.path">...</span>
      <span class="ml-1">评论</span>
    </div>
    <div v-if="moment.location" class="flex items-center">
      <Icon name="uil:map-marker" class="w-4 h-4 mr-1" />
      <span>{{ moment.location }}</span>
    </div>
    <div v-if="moment.tags" class="flex items-center">
      <Icon name="uil:tag-alt" class="w-4 h-4 mr-1" />
      <template v-for="tag in moment.tags" :key="tag">
        <NuxtLink :to="`/moments/tag/${encodeTag(tag)}`" class="!border-b-0">
          {{ tag }}
        </NuxtLink>
        <span class="mx-1 font-sans text-sm font-normal leading-normal pointer-events-none select-none text-slate-400 dark:text-slate-600 last:hidden">/</span>
      </template>
    </div>
  </div>
</template>
