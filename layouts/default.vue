<script setup lang="ts">
const { page } = useContent()
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
      <main class="max-w-none prose prose-slate dark:prose-invert text-base">
        <template v-if="page">
          <h1 v-if="page.title">
            {{ page.title }}
          </h1>
          <template v-if="isPost">
            <PostInfo :page="page" />
            <NuxtImg v-if="coverPath" :src="coverPath" :alt="page.title" class="w-full" :width="1920" :height="900" />
            <div :class="page.class">
              <slot />
            </div>
            <TextHr>正文完</TextHr>
            <Artalk :path="page._path" :title="page.title" />
          </template>
          <slot v-else />
        </template>
        <slot v-else />
      </main>
    </div>
  </div>
</template>
