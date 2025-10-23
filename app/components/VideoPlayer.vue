<script lang="ts" setup>
interface Props {
  filename: string
  class?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
}

const props = defineProps<Props>()
const post = await usePost()
</script>

<template>
  <video
    :src="`/static/${post?.stem}/${props.filename}`"
    :class="props.class"
    :autoplay="props.autoplay"
    :controls="props.controls"
    :loop="props.loop"
  />
</template>
