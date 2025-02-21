<script lang="ts" setup>
import type { MomentsCollectionItem } from '@nuxt/content'

defineProps<{
  moment: MomentsCollectionItem
}>()
</script>

<template>
  <div class="not-prose">
    <p>
      {{ moment.text }}
    </p>
    <div v-if="moment.media" class="flex flex-wrap mt-2">
      <div v-for="media in moment.media" :key="media" class="h-32 rounded-lg mr-2">
        <NuxtImg
          v-if="media.type === 'image'"
          :src="`/static/${moment.stem}/${media.filename}`"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
</template>
