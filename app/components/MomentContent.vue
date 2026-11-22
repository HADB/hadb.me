<script lang="ts" setup>
import type { MomentsCollectionItem } from '@nuxt/content'

const props = defineProps<{
  moment: MomentsCollectionItem
}>()

const publicPath = usePublicPath()
const img = useImage()
const imageList = ref<HTMLDivElement>()
const viewer = shallowRef<{ type: 'image' | 'video', index: number, origin?: { rect: DOMRect, src: string } } | null>(null)

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
  src: publicPath(path),
  thumbnail: img(path, imageThumbnailOptions),
}))

function openImage(index: number, event: MouseEvent) {
  const thumbnail = (event.currentTarget as HTMLButtonElement).querySelector('img')
  const origin = thumbnail?.naturalWidth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? { rect: thumbnail.getBoundingClientRect(), src: thumbnail.currentSrc }
    : undefined
  viewer.value = { type: 'image', index, origin }
}

function resolveThumbnail(index: number) {
  return imageList.value?.querySelectorAll<HTMLImageElement>('button img').item(index)
}

const videos: { id: string, src: string, thumbnail?: string, duration?: number }[] = []
for (const media of props.moment.media ?? []) {
  if (media.type !== 'video' || !media.id) {
    continue
  }

  const mediaInfo = await useMediaInfo(media.id)
  videos.push({
    id: media.id,
    src: `https://peertube.hadb.me/videos/embed/${media.id}?p2p=0`,
    thumbnail: mediaInfo.value?.previewPath ? `https://peertube.hadb.me${mediaInfo.value.previewPath}` : undefined,
    duration: mediaInfo.value?.duration,
  })
}
</script>

<template>
  <div class="not-prose">
    <ContentRenderer :value="moment" />
    <div v-if="moment.media" class="mt-2">
      <div
        v-if="images.length"
        ref="imageList"
        :class="images.length > 1 ? 'grid gap-3 grid-cols-3 lg:grid-cols-9' : 'flex'"
      >
        <button
          v-for="(image, index) in images"
          :key="image.path"
          type="button"
          :aria-label="`查看第 ${index + 1} 张图片`"
          :class="{ 'aspect-square': images.length > 1 }"
          class="inline-block cursor-pointer"
          @click="openImage(index, $event)"
        >
          <NuxtImg
            :src="image.path"
            v-bind="imageThumbnailOptions"
            alt=""
            placeholder-class="bg-slate-300 dark:bg-slate-700"
            :class="images.length > 1 ? 'w-full h-full object-cover' : 'max-w-64 max-h-36 object-contain object-top-left'"
          />
        </button>
      </div>

      <div
        v-if="videos.length"
        :class="videos.length > 1 ? 'grid gap-3 grid-cols-3 lg:grid-cols-9' : 'flex'"
      >
        <button
          v-for="(video, index) in videos"
          :key="video.id"
          type="button"
          :aria-label="`播放第 ${index + 1} 个视频`"
          :class="{ 'aspect-square': videos.length > 1 }"
          class="inline-block relative cursor-pointer"
          @click="viewer = { type: 'video', index }"
        >
          <NuxtImg
            v-if="video.thumbnail"
            :src="video.thumbnail"
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
        </button>
      </div>
      <MomentMediaViewer
        v-if="viewer"
        :type="viewer.type"
        :items="viewer.type === 'image' ? images : videos"
        :initial-index="viewer.index"
        :origin="viewer.origin"
        :resolve-thumbnail="resolveThumbnail"
        @close="viewer = null"
      />
    </div>
  </div>
</template>
