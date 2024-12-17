<script lang="ts" setup>
interface Props {
  index: string
  extension?: string
  darkSupported?: boolean
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
  <p>
    <NuxtImg class="light-image" :src="imageUrl" />
    <NuxtImg class="dark-image" :src="darkImageUrl" />
  </p>
</template>
