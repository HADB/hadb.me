<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <MomentTags />
  <MomentList :tag="route.query.tag" />
</template>
