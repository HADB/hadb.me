<script lang="ts" setup>
const { data: postTags } = await useAsyncData('post-tags', () => queryCollection('posts')
  .where('draft', '=', false)
  .where('tags', 'IS NOT NULL')
  .select('tags')
  .all())
const tags = flatTags(postTags.value)
</script>

<template>
  <div class="flex flex-wrap">
    <div v-for="tag in tags" :key="tag.name" class="text-base mr-6 my-2">
      <NuxtLink :to="`/posts/tag/${encodeTag(tag.name)}`" class="!border-b-0">
        <span class="text-slate-500">#</span> {{ tag.name }}
      </NuxtLink>
      <span class="ml-2 text-sm font-mono text-slate-500">({{ tag.count }})</span>
    </div>
  </div>
</template>
