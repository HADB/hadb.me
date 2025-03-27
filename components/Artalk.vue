<script lang="ts" setup>
import Artalk from 'artalk'

interface Props {
  path?: string
  title?: string
}

const props = defineProps<Props>()
const siteConfig = useSiteConfig()
let artalk: Artalk
const artalkEl = ref<HTMLElement>()

onMounted(() => {
  artalk = Artalk.init({
    el: artalkEl.value,
    pageKey: props.path,
    pageTitle: props.title,
    server: 'https://artalk.hadb.me/',
    site: siteConfig.name,
  })
})

onBeforeUnmount(() => {
  artalk?.destroy()
})
</script>

<template>
  <div ref="artalkEl" class="artalk not-prose" />
</template>
