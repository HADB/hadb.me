<script lang="ts" setup>
import type { MomentsCollectionItem } from '@nuxt/content'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgVideo from 'lightgallery/plugins/video'
import lgZoom from 'lightgallery/plugins/zoom'
import Lightgallery from 'lightgallery/vue'

const props = defineProps<{
  moment: MomentsCollectionItem
}>()

const gallerySettings = {
  licenseKey: 'HADB.ME',
  speed: 500,
  plugins: [lgZoom, lgVideo, lgThumbnail],
  thumbnail: true,
  mobileSettings: {
    controls: false,
    showCloseIcon: true,
  },
}

const images = props.moment.media?.filter((media) => media.type === 'image') || []
const videos = props.moment.media?.filter((media) => media.type === 'video') || []

for (const video of videos) {
  if (video.id) {
    const mediaInfo = await useMediaInfo(video.id)
    if (mediaInfo.value) {
      video.poster = `https://peertube.hadb.me${mediaInfo.value.previewPath}`
      video.duration = mediaInfo.value.duration
    }
  }
}
</script>

<template>
  <div class="not-prose">
    <ContentRenderer :value="moment" />
    <div v-if="moment.media" class="mt-2">
      <Lightgallery
        v-if="images.length > 0"
        :settings="gallerySettings"
        :class="{
          'grid gap-3 grid-cols-3 lg:grid-cols-9': images.length > 1,
          'flex': images.length === 1,
        }"
      >
        <a
          v-for="image in images"
          :key="`${image.type}-${image.id}-${image.filename}`"
          :href="`/static/${moment.stem}/${image.filename}`"
          :class="{ 'aspect-square': images.length > 1 }"
          class="inline-block"
        >
          <NuxtImg
            v-if="image.filename"
            :src="`/static/${moment.stem}/${image.filename}`"
            placeholder-class="bg-slate-300 dark:bg-slate-700"
            :class="{
              'w-full h-full object-cover': images.length > 1,
              'max-w-64 max-h-36 object-contain object-top-left': images.length === 1,
            }"
          />
        </a>
      </Lightgallery>

      <Lightgallery
        v-if="videos.length > 0"
        :settings="{ ...gallerySettings, videojs: true, download: false, zoom: false }"
        :class="{
          'grid gap-3 grid-cols-3 lg:grid-cols-9': videos.length > 1,
          'flex': videos.length === 1,
        }"
      >
        <button
          v-for="video in videos"
          :key="`${video.type}-${video.id}`"
          :data-src="`https://peertube.hadb.me/videos/embed/${video.id}?p2p=0`"
          data-iframe="true"
          :class="{ 'aspect-square': videos.length > 1 }"
          class="inline-block relative"
        >
          <NuxtImg
            v-if="video.poster"
            placeholder-class="bg-slate-300 dark:bg-slate-700"
            :src="video.poster"
            :class="{
              'w-full h-full object-cover': videos.length > 1,
              'max-w-full sm:max-w-64 sm:max-h-36 object-contain object-top-left': videos.length === 1,
            }"
          />
          <span v-if="video.duration" class="absolute bottom-0 right-0 m-1 px-1.5 py-0.5 bg-black bg-opacity/50 text-white text-xs rounded-md">
            {{ formatDuration(video.duration) }}
          </span>
        </button>
      </Lightgallery>
    </div>
  </div>
</template>
