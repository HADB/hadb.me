<script lang="ts" setup>
import type { MomentsCollectionItem } from '@nuxt/content'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgVideo from 'lightgallery/plugins/video'
import lgZoom from 'lightgallery/plugins/zoom'
import Lightgallery from 'lightgallery/vue'

defineProps<{
  moment: MomentsCollectionItem
}>()

const gallerySettings = {
  licenseKey: 'HADB.ME',
  speed: 500,
  plugins: [lgZoom, lgVideo, lgThumbnail],
  thumbnail: true,
}
</script>

<template>
  <div class="not-prose">
    <p>
      {{ moment.text }}
    </p>
    <div v-if="moment.media" class="flex flex-wrap mt-2">
      <Lightgallery :settings="gallerySettings">
        <a
          v-for="media in moment.media.filter(media => media.type === 'image')"
          :key="media"
          :href="`/static/${moment.stem}/${media.filename}`"
          class="inline-block h-32 rounded-lg mr-2"
        >
          <NuxtImg
            v-if="media.type === 'image' && media.filename"
            :src="`/static/${moment.stem}/${media.filename}`"
            class="w-full h-full object-cover rounded-md"
          />
        </a>
      </Lightgallery>

      <Lightgallery :settings="{ ...gallerySettings, videojs: true }">
        <button
          v-for="media in moment.media.filter(media => media.type === 'video')"
          :key="media.id"
          :data-src="`https://media.hadb.me/embed?m=${media.id}`"
          data-iframe="true"
          class="inline-block h-32 rounded-lg mr-2"
        >
          <NuxtImg
            v-if="media.type === 'video' && media.id"
            :src="media.thumbnail"
            class="w-full h-full object-cover rounded-md"
          />
        </button>
      </Lightgallery>
    </div>
  </div>
</template>
