<script lang="ts" setup>
interface Props {
  width?: number
  height?: number
}

withDefaults(defineProps<Props>(), {
  width: 512,
  height: 512,
})
</script>

<template>
  <NuxtImg :width="width" :height="height" src="/static/reward-code.jpg" alt="赞赏码" />
</template>
