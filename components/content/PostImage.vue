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
const colorMode = useColorMode()
const imageUrl = ref(`/images${page.value._path}-${props.index}.${props.extension}`)

watch(colorMode, updateImageUrl)

onMounted(updateImageUrl)

function updateImageUrl() {
  if (props.darkSupported && colorMode.value === 'dark') {
    imageUrl.value = `/images${page.value._path}-${props.index}-dark.${props.extension}`
  }
  else {
    imageUrl.value = `/images${page.value._path}-${props.index}.${props.extension}`
  }
}
</script>

<template>
  <p>
    <NuxtImg :src="imageUrl" />
  </p>
</template>
