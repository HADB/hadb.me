<script setup lang="ts">
import SurroundPostLink from '~/components/SurroundPostLink.vue'

const { page, prev, next } = useContent()
const isPost = page.value?._dir === 'posts'
const coverPath = page.value?.cover ? getCoverPath(page.value._path, page.value.cover) : ''

useHead({
  titleTemplate: (title) => {
    return seoTitle(title)
  },
  meta: [{
    property: 'og:title',
    content: seoTitle(page.value?.title),
  }],
})
</script>

<template>
  <div class="p-4 sm:p-12">
    <div class="max-w-7xl p-4 sm:p-12 m-auto bg-white dark:bg-slate-800 rounded-lg outline outline-1 outline-slate-200 dark:outline-slate-700">
      <main class="max-w-none prose prose-slate dark:prose-invert">
        <template v-if="page">
          <h1 v-if="page.title">
            {{ page.title }}
          </h1>
          <template v-if="isPost">
            <PostInfo :page="page" />
            <NuxtImg v-if="coverPath" :src="coverPath" :alt="page.title" class="w-full" :width="page.coverSize?.width || 1920" :height="page.coverSize?.height || 900" />
            <div :class="page.class">
              <slot />
            </div>
            <TextHr :class="{ hidden: page.hideComments }">
              评论区
            </TextHr>
            <Artalk :path="page._path" :title="page.title" :class="{ hidden: page.hideComments }" />
            <div class="grid gap-4 sm:gap-12 sm:grid-cols-2 mt-4">
              <SurroundPostLink :post="next" type="next" />
              <SurroundPostLink :post="prev" type="prev" />
            </div>
          </template>
          <template v-else>
            <slot />
            <TextHr :class="{ hidden: page.hideComments }">
              评论区
            </TextHr>
            <Artalk :path="page._path" :title="page.title" :class="{ hidden: page.hideComments }" />
          </template>
        </template>
        <slot v-else />
      </main>
    </div>
  </div>
</template>
