<script lang="ts" setup>
import type { LgGalleryItem } from '@lightgallery/vue'
import type { MomentsCollectionItem } from '@nuxt/content'
import { LgItem, LightGallery } from '@lightgallery/vue'
import Thumbnail from '@lightgallery/vue/plugins/thumbnail'
import Zoom from '@lightgallery/vue/plugins/zoom'

const props = defineProps<{
  moment: MomentsCollectionItem
}>()

const publicPath = usePublicPath()
const img = useImage()
const gallerySettings = {
  licenseKey: 'HADB.ME',
  speed: 500,
  mobileSettings: {
    controls: false,
    showCloseIcon: true,
  },
}
const imagePlugins = [Zoom, Thumbnail]
const videoPlugins = [Thumbnail]

const imagePaths = (props.moment.media ?? []).flatMap((media) => media.type === 'image' && media.filename
  ? [`/static/${props.moment.stem}/${media.filename}` as const]
  : [])
const imageThumbnailOptions = {
  width: 256,
  height: imagePaths.length > 1 ? 256 : 144,
  fit: imagePaths.length > 1 ? 'cover' : 'inside',
}
const images = imagePaths.map((path) => ({
  path,
  item: {
    src: publicPath(path),
    thumb: img(path, imageThumbnailOptions),
  },
}))

const videos: { id: string, item: LgGalleryItem, poster?: string, duration?: number }[] = []
for (const media of props.moment.media ?? []) {
  if (media.type !== 'video' || !media.id) {
    continue
  }

  const mediaInfo = await useMediaInfo(media.id)
  const poster = mediaInfo.value?.previewPath ? `https://peertube.hadb.me${mediaInfo.value.previewPath}` : undefined
  videos.push({
    id: media.id,
    item: {
      src: `https://peertube.hadb.me/videos/embed/${media.id}?p2p=0`,
      iframe: true,
      iframeTitle: 'PeerTube 视频',
      thumb: poster,
    },
    poster,
    duration: mediaInfo.value?.duration,
  })
}
const availableVideoPlugins = videos.length > 1 && videos.every((video) => video.poster) ? videoPlugins : []
</script>

<template>
  <div class="not-prose">
    <ContentRenderer :value="moment" />
    <div v-if="moment.media" class="mt-2">
      <div
        v-if="images.length"
        :class="images.length > 1 ? 'grid gap-3 grid-cols-3 lg:grid-cols-9' : 'flex'"
      >
        <LightGallery v-bind="gallerySettings" :plugins="imagePlugins">
          <LgItem
            v-for="(image, index) in images"
            :key="image.path"
            :item="image.item"
            :aria-label="`查看第 ${index + 1} 张图片`"
            :class="{ 'aspect-square': images.length > 1 }"
            class="inline-block"
          >
            <NuxtImg
              :src="image.path"
              v-bind="imageThumbnailOptions"
              alt=""
              placeholder-class="bg-slate-300 dark:bg-slate-700"
              :class="images.length > 1 ? 'w-full h-full object-cover' : 'max-w-64 max-h-36 object-contain object-top-left'"
            />
          </LgItem>
        </LightGallery>
      </div>

      <div
        v-if="videos.length"
        :class="videos.length > 1 ? 'grid gap-3 grid-cols-3 lg:grid-cols-9' : 'flex'"
      >
        <LightGallery
          v-bind="gallerySettings"
          :plugins="availableVideoPlugins"
          :download="false"
          :zoom-from-origin="false"
        >
          <LgItem
            v-for="(video, index) in videos"
            :key="video.id"
            :item="video.item"
            :aria-label="`播放第 ${index + 1} 个视频`"
            :class="{ 'aspect-square': videos.length > 1 }"
            class="inline-block relative"
          >
            <NuxtImg
              v-if="video.poster"
              :src="video.poster"
              alt=""
              placeholder-class="bg-slate-300 dark:bg-slate-700"
              :width="256"
              :height="videos.length > 1 ? 256 : 144"
              fit="cover"
              :class="videos.length > 1 ? 'w-full h-full object-cover' : 'max-w-full sm:max-w-64 sm:max-h-36 object-contain object-top-left'"
            />
            <span v-else>播放视频</span>
            <span v-if="video.duration" class="absolute bottom-0 right-0 m-1 px-1.5 py-0.5 bg-black bg-opacity/50 text-white text-xs rounded-md">
              {{ formatDuration(video.duration) }}
            </span>
          </LgItem>
        </LightGallery>
      </div>
    </div>
  </div>
</template>
