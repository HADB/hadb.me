<script lang="ts" setup>
defineProps({
  image: {
    type: String,
    default: null,
  },
  imageAlt: {
    type: String,
    default: 'Hero Image',
  },
  imagePosition: {
    type: String,
    default: 'right',
  },
})
</script>

<template>
  <div class="grid gap-12 grid-cols-1 lg:grid-cols-2">
    <div>
      <ContentSlot :use="$slots.content" />
    </div>
    <NuxtImg
      v-if="image"
      :class=" imagePosition === 'left' ? '-order-1' : '' "
      class="m-0 w-full object-cover"
      :src="image"
      :alt="imageAlt"
    />
  </div>
</template>
