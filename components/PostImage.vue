<script lang="ts" setup>
interface Props {
  filename: string
  darkSupported?: boolean
  width?: number
  height?: number
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  darkSupported: false,
})

const post = await usePost()
const imageUrl = ref(`/static/${post.value?.stem}/${props.filename}`)
const darkImageUrl = ref(`/static/${post.value?.stem}/dark-${props.filename}`)
</script>

<template>
  <template v-if="darkSupported">
    <NuxtImg class="light-image" :width="width" :height="height" :src="imageUrl" />
    <NuxtImg class="dark-image" :width="width" :height="height" :src="darkImageUrl" />
  </template>
  <template v-else>
    <NuxtImg :width="width" :height="height" :src="imageUrl" />
  </template>
  <p v-if="description" class="text-sm text-center text-slate-500 -mt-6">
    {{ description }}
  </p>
</template>
