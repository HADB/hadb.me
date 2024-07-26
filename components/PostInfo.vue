<script lang="ts" setup>
defineProps({
  page: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="flex items-center text-sm text-slate-500">
    <template v-if="page?.date">
      <span>
        <time :datetime="page.date">
          {{ formatDateTime(page.date, 'yyyy 年 MM 月 dd 日') }}
        </time>
      </span>
      <span class="mx-2">·</span>
    </template>
    <span>共 {{ page.readingTime.words }} 字</span>
    <span class="mx-2">·</span>
    <span>约 {{ getReadingMinutes(page.readingTime.time) }} 分钟</span>
  </div>
</template>
