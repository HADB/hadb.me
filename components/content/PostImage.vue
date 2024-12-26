<script lang="ts" setup>
interface Props {
  index: string
  extension?: string
  darkSupported?: boolean
  width?: number
  height?: number
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  extension: 'jpg',
  darkSupported: false,
})

const { page } = useContent()
const imageUrl = ref(`/images${page.value._path}-${props.index}.${props.extension}`)
const darkImageUrl = ref(`/images${page.value._path}-${props.index}-dark.${props.extension}`)
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
