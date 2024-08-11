<script lang="ts" setup>
interface Props {
  src: string
  class?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <video
    :src="props.src"
    :class="props.class"
    :autoplay="props.autoplay"
    :controls="props.controls"
    :loop="props.loop"
  />
</template>
