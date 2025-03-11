<script lang="ts" setup>
const route = useRoute()
const tag = decodeURIComponent(route.params.tag as string)

useHead({
  title: tag,
  titleTemplate: (title) => {
    return seoTitle(title)
  },
  meta: [{
    property: 'og:title',
    content: seoTitle(tag),
  }],
})
</script>

<template>
  <NuxtLayout>
    <h1><span class="text-slate-500">#</span> {{ tag }} 相关动态</h1>
    <MomentList :tag="tag" />
  </NuxtLayout>
</template>
