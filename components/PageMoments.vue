<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <MomentTags />
  <MomentList :tag="route.params.tag?.toString()" />
</template>
