<script setup lang="ts">
import type { LayoutKey } from '#build/types/layouts'

const { contentHead } = useRuntimeConfig().public.content
const { page, layout } = useContent()
const route = useRoute()

// 注意：以下 301 跳转只在 SSR 时生效
if (!(page as any).value) {
  // 支持将旧的带日期的路径 301 跳转至 /posts/ 下
  if (route.path.match(/^\/\d{4}\/\d{2}\/\d{2}\/(.+)$/)) {
    navigateTo(`/posts/${route.params.slug[3]}`, { redirectCode: 301 })
  }

  // 支持旧的不带日期的路径 301 跳转至 /posts/ 下
  // 动态的 queryContent 请求在 SSG 下不生效
  const { data: fallbackPost } = await useAsyncData(`fallbackPost-${route.path}`, () => queryContent('posts', route.params.slug[0]).only('_path').findOne())
  if (fallbackPost.value) {
    navigateTo(fallbackPost.value._path, { redirectCode: 301 })
  }

  // Page not found, set correct status code on SSR
  if (import.meta.server) {
    const event = useRequestEvent()
    if (event) {
      event.node.res.statusCode = 404
    }
  }
}

if (contentHead) {
  useContentHead(page)
}
</script>

<template>
  <div class="document-driven-page">
    <NuxtLayout :name="layout as LayoutKey || 'default'">
      <ContentRenderer v-if="page" :key="(page as any)._id" :value="page">
        <template #empty="{ value }">
          <DocumentDrivenEmpty :value="value" />
        </template>
      </ContentRenderer>
      <DocumentDrivenNotFound v-else />
    </NuxtLayout>
  </div>
</template>
