<script lang="ts" setup>
interface Props {
  index: string
  extension?: string
  darkSupported?: boolean
  width?: number
  height?: number
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
  <p v-if="darkSupported">
    <NuxtImg class="light-image" :width="width" :height="height" :src="imageUrl" />
    <NuxtImg class="dark-image" :width="width" :height="height" :src="darkImageUrl" />
  </p>
  <p v-else>
    <NuxtImg :width="width" :height="height" :src="imageUrl" />
  </p>
</template>
