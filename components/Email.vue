<script lang="ts" setup>
const props = defineProps<{
  email: string
}>()

const email_prefix = props.email.split('@')[0]
const email_suffix = props.email.split('@')[1]
</script>

<template>
  <span class="inline-flex items-center">
    {{ email_prefix }}
    <UIcon name="uil:at" class="mx-0.5" />
    {{ email_suffix }}
  </span>
</template>
