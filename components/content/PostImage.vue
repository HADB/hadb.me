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
const darkImageUrl = ref(`/images${page.value._path}-${props.index}-dark.${props.extension}`)
const isDark = ref(false)

watch(colorMode, updateImageUrl)

onMounted(updateImageUrl)

function updateImageUrl() {
  if (props.darkSupported && colorMode.value === 'dark') {
    isDark.value = true
  }
  else {
    isDark.value = false
  }
}
</script>

<template>
  <p>
    <NuxtImg v-show="!isDark" :src="imageUrl" />
    <NuxtImg v-show="isDark" :src="darkImageUrl" />
  </p>
</template>
