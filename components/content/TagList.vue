<script lang="ts" setup>
const { data: postTags } = await useAsyncData('post-tags', () => queryContent('posts').where({ tags: { $exists: true } }).only(['tags']).find())
const tags = flatTags(postTags.value)
</script>

<template>
  <div class="flex flex-wrap">
    <div v-for="tag in tags" :key="tag.name" class="mr-6 my-2">
      <NuxtLink :to="`/tags/${encodeURIComponent(tag.name)}`" class="!border-b-0">
        {{ tag.name }}
      </NuxtLink>
      <span class="ml-2 text-sm font-mono text-slate-500">({{ tag.count }})</span>
    </div>
  </div>
</template>
