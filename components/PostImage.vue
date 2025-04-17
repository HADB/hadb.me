<script lang="ts" setup>
interface Props {
  filename: string
  darkSupported?: boolean
  width?: number
  height?: number
  description?: string
}

const {
  filename,
  darkSupported = false,
  width,
  height,
  description,
} = defineProps<Props>()

const post = await usePost()
const imageUrl = ref(`/static/${post.value?.stem}/${filename}`)
const darkImageUrl = ref(`/static/${post.value?.stem}/dark-${filename}`)
</script>

<template>
  <figure>
    <template v-if="darkSupported">
      <NuxtImg class="light-image" :width="width" :height="height" :src="imageUrl" :alt="description" />
      <NuxtImg class="dark-image" :width="width" :height="height" :src="darkImageUrl" :alt="description" />
    </template>
    <template v-else>
      <NuxtImg :width="width" :height="height" :src="imageUrl" :alt="description" />
    </template>
    <figcaption v-if="description" class="block text-sm text-center text-slate-500 -mt-6">
      {{ description }}
    </figcaption>
  </figure>
</template>
