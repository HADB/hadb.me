<script setup lang="ts">
const moment = await useMoment()

if (!moment.value && import.meta.server) {
  const event = useRequestEvent()
  if (event) {
    event.node.res.statusCode = 404
  }
}

console.log('moment', moment.value)

useHead({
  title: '动态详情',
  titleTemplate: (title) => {
    return seoTitle(title)
  },
  meta: [{
    property: 'og:title',
    content: seoTitle('动态详情'),
  }, {
    property: 'description',
    content: moment.value?.description,
  }, {
    property: 'og:description',
    content: moment.value?.description,
  }],
})
</script>

<template>
  <NuxtLayout>
    <template v-if="moment">
      <h1>动态详情</h1>
      <MomentInfo :moment="moment" />
      <MomentContent :moment="moment" class="my-5" />
      <TextHr :class="{ hidden: moment.hideComments }">
        评论区
      </TextHr>
      <Artalk :path="moment.path" :title="moment.title" :class="{ hidden: moment.hideComments }" />
    </template>
    <ErrorPageNotFound v-else />
  </NuxtLayout>
</template>
