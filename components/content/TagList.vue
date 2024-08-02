<script lang="ts" setup>
interface Tag {
  name: string
  count: number
}

const postTags = await queryContent('posts').where({ tags: { $exists: true } }).only(['tags']).find()
const tags = postTags.map((p) => p.tags).flat().reduce((acc, curr) => {
  const found = acc.find((tag: Tag) => tag.name === curr)
  if (found) {
    found.count += 1
  }
  else {
    acc.push({ name: curr, count: 1 })
  }
  return acc
}, []).sort((a: Tag, b: Tag) => {
  if (a.count === b.count) {
    return a.name.localeCompare(b.name, 'zh-CN')
  }
  return b.count - a.count
})
</script>

<template>
  <div class="flex flex-wrap">
    <div v-for="tag in tags" :key="tag.name" class="mr-6">
      <NuxtLink :to="`/tags/${encodeURIComponent(tag.name)}`" class="!border-b-0">
        {{ tag.name }}
      </NuxtLink>
      <span class="ml-2 text-sm font-mono text-slate-500">({{ tag.count }})</span>
    </div>
  </div>
</template>
