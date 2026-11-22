<script lang="ts" setup>
import Artalk from 'artalk'

interface Props {
  path?: string
  title?: string
}

const props = defineProps<Props>()
const siteConfig = useSiteConfig()
const server = 'https://artalk.hadb.me'
const availabilityCheck = new AbortController()
let artalk: Artalk | undefined
const artalkEl = ref<HTMLElement>()
const commentsVisible = ref(false)

function hideComments() {
  commentsVisible.value = false
  artalk?.destroy()
  artalk = undefined
}

onMounted(async () => {
  // Artalk.init starts an asynchronous config request that its caller cannot catch.
  const timeout = window.setTimeout(() => availabilityCheck.abort(), 5000)
  try {
    const response = await fetch(`${server}/api/v2/conf`, { signal: availabilityCheck.signal })
    if (!response.ok) {
      return
    }
    await response.json()
  }
  catch {
    return
  }
  finally {
    window.clearTimeout(timeout)
  }

  if (availabilityCheck.signal.aborted || !artalkEl.value) {
    return
  }

  artalk = Artalk.init({
    el: artalkEl.value,
    pageKey: props.path,
    pageTitle: props.title,
    server,
    site: siteConfig.name,
  })
  artalk.on('list-loaded', () => {
    commentsVisible.value = !!artalk
  })
  artalk.on('list-failed', hideComments)
})

onBeforeUnmount(() => {
  availabilityCheck.abort()
  hideComments()
})
</script>

<template>
  <div v-show="commentsVisible">
    <TextHr>评论区</TextHr>
    <div ref="artalkEl" class="artalk not-prose" />
  </div>
</template>
