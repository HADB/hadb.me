<script setup lang="ts">
interface ZoomAnchor {
  anchorX: number
  anchorY: number
}

const props = defineProps<{
  type: 'image' | 'video'
  items: { src: string, thumbnail?: string }[]
  initialIndex: number
  origin?: { rect: DOMRect, src: string }
  resolveThumbnail?: (index: number) => HTMLImageElement | null | undefined
}>()
const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLDialogElement>()
const stage = ref<HTMLDivElement>()
const track = ref<HTMLDivElement>()
const transitionPhoto = ref<HTMLImageElement>()
const transitionSource = ref(props.origin?.src)
const opening = ref(Boolean(props.origin))
const openingMotion = ref(false)
const closingFrame = shallowRef<Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>>()
const closingMotion = ref(false)
const transitionFrame = computed(() => closingFrame.value ?? (opening.value ? props.origin?.rect : undefined))
const position = ref(props.initialIndex)
const zoomLevel = ref(1)
const zoomed = computed(() => zoomLevel.value > 1)
const zoomArea = shallowRef<{ width: string, height: string }>()
const videoLoading = ref(true)
const loadedImages = reactive(new Set<string>())
const showLoading = ref(false)
const dragOffset = ref(0)
const incomingSlide = shallowRef<{ direction: number, position: number }>()
const index = computed(() => wrap(position.value))
const current = computed(() => props.items[index.value]!)
const mediaLabel = computed(() => props.type === 'image' ? '图片' : '视频')
const hasMultiple = computed(() => props.items.length > 1)
const loading = computed(() => props.type === 'image' ? !loadedImages.has(current.value.src) : videoLoading.value)
const slides = computed(() => (hasMultiple.value && !zoomed.value ? [-1, 0, 1] : [0]).map((offset) => {
  const slidePosition = incomingSlide.value?.direction === offset ? incomingSlide.value.position : position.value + offset
  return { offset, position: slidePosition, item: props.items[wrap(slidePosition)]! }
}))
const minimumFlickDistance = 30
const minimumFlickSpeed = 0.5
const velocityWindow = 120
const slideGap = 16
const motionDuration = 300
const doubleTapDelay = 280
const loadingIndicatorDelay = 150
const viewerButton = {
  color: 'neutral',
  variant: 'outline',
  size: 'lg',
  square: true,
  class: 'size-10 justify-center rounded-full',
} as const
let slideAnimation: Animation | undefined
let zoomAnimation: Animation | undefined
let openingAnimation: Animation | undefined
let closingAnimation: Animation | undefined
let stageResizeObserver: ResizeObserver | undefined
let swipeHistory: { offset: number, time: number }[] = []
let touchStart: { x: number, y: number } | undefined
let touchPan: { x: number, y: number, left: number, top: number } | undefined
let pinch: (ZoomAnchor & { distance: number, level: number }) | undefined
let trackpadPinch: (ZoomAnchor & { level: number, x: number, y: number }) | undefined
let tapStart: { pointerId: number, x: number, y: number } | undefined
let pendingTap: { x: number, y: number, timer: number } | undefined
let drag: { pointerId: number, x: number, y: number, left: number, top: number } | undefined

watch(() => loading.value && !opening.value && !closingFrame.value, (waiting, _, onCleanup) => {
  showLoading.value = false
  if (waiting) {
    const timer = setTimeout(() => {
      showLoading.value = true
    }, loadingIndicatorDelay)
    onCleanup(() => clearTimeout(timer))
  }
}, { immediate: true })

function wrap(next: number) {
  const count = props.items.length
  return ((next % count) + count) % count
}

function isSliding() {
  return Boolean(slideAnimation || incomingSlide.value)
}

function stopSlide() {
  slideAnimation?.cancel()
  slideAnimation = undefined
  incomingSlide.value = undefined
}

function select(next: number) {
  stopSlide()
  stopOpening()
  stopZoomAnimation()
  clearDrag()
  if (props.type === 'video' && wrap(next) !== index.value) {
    videoLoading.value = true
  }
  position.value = next
  if (zoomed.value) {
    stage.value?.scrollTo(0, 0)
    zoomLevel.value = 1
  }
}

async function moveSlide(direction: -1 | 0 | 1, offset = 0, next = position.value + direction) {
  if (isSliding() || closingFrame.value) {
    return
  }

  cancelPendingTap()
  stopOpening()
  stopZoomAnimation()
  const width = stage.value?.clientWidth
  const row = track.value
  if (!row || !width || zoomed.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    select(next)
    return
  }

  if (next !== position.value + direction) {
    const incoming = { direction, position: next }
    incomingSlide.value = incoming
    await nextTick()
    const photo = row.querySelector<HTMLImageElement>(`[data-slide="${direction}"]`)
    if (photo) {
      await Promise.race([
        photo.decode().catch(() => {}),
        new Promise<void>((resolve) => window.setTimeout(resolve, 160)),
      ])
    }
    if (incomingSlide.value !== incoming) {
      return
    }
  }

  const animation = row.animate([
    { transform: `translateX(${offset}px)` },
    { transform: `translateX(${-direction * (width + slideGap)}px)` },
  ], { duration: motionDuration, easing: 'cubic-bezier(0.2, 0.65, 0.3, 1)', fill: 'forwards' })
  slideAnimation = animation
  await animation.finished.catch(() => {})
  if (slideAnimation === animation) {
    slideAnimation = undefined
    select(next)
    await nextTick()
  }
  animation.cancel()
}

async function selectThumbnail(thumbnailIndex: number) {
  if (isSliding() || zoomAnimation || closingFrame.value) {
    return
  }
  if (zoomed.value) {
    await toggleZoom()
  }

  const distance = thumbnailIndex - index.value
  if (distance) {
    await moveSlide(distance < 0 ? -1 : 1, 0, position.value + distance)
  }
}

async function toggleZoom(event?: MouseEvent) {
  const viewport = stage.value
  const photo = track.value?.querySelector<HTMLImageElement>('[data-slide="0"]')
  if (!viewport || !photo?.naturalWidth || isSliding() || zoomAnimation || closingFrame.value) {
    return
  }

  cancelPendingTap()
  stopOpening()
  clearDrag()
  const before = fittedPhotoRect(photo)
  const enlarge = !zoomed.value
  const bounds = viewport.getBoundingClientRect()
  const x = event?.clientX ?? bounds.left + viewport.clientWidth / 2
  const y = event?.clientY ?? bounds.top + viewport.clientHeight / 2
  zoomLevel.value = enlarge ? 2 : 1
  if (enlarge) {
    updateZoomArea(viewport, photo)
  }
  await nextTick()
  if (stage.value !== viewport || zoomed.value !== enlarge || !track.value?.contains(photo)) {
    return
  }

  if (enlarge) {
    scrollToPhotoPoint(viewport, photo, (x - before.left) / before.width, (y - before.top) / before.height, x, y)
  }
  else {
    viewport.scrollTo(0, 0)
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  // Keep the photo at its previous bounds on the first frame after the layout changes.
  const after = fittedPhotoRect(photo)
  const photoBounds = photo.getBoundingClientRect()
  const ratio = before.width / after.width
  const dx = before.left - photoBounds.left - (after.left - photoBounds.left) * ratio
  const dy = before.top - photoBounds.top - (after.top - photoBounds.top) * ratio
  const animation = photo.animate([
    {
      transformOrigin: '0 0',
      transform: `translate(${dx}px, ${dy}px) scale(${ratio})`,
    },
    { transformOrigin: '0 0', transform: 'none' },
  ], { duration: motionDuration, easing: 'cubic-bezier(0.2, 0.65, 0.3, 1)' })
  zoomAnimation = animation
  await animation.finished.catch(() => {})
  if (zoomAnimation === animation) {
    zoomAnimation = undefined
  }
}

function updateZoomArea(viewport: HTMLDivElement, photo: HTMLImageElement) {
  const { clientWidth, clientHeight } = viewport
  const scale = fitScale(photo, clientWidth, clientHeight) * zoomLevel.value
  zoomArea.value = {
    width: `${Math.max(clientWidth, photo.naturalWidth * scale)}px`,
    height: `${Math.max(clientHeight, photo.naturalHeight * scale)}px`,
  }
}

function scrollToPhotoPoint(viewport: HTMLDivElement, photo: HTMLImageElement, anchorX: number, anchorY: number, x: number, y: number) {
  const frame = fittedPhotoRect(photo)
  viewport.scrollBy(frame.left + anchorX * frame.width - x, frame.top + anchorY * frame.height - y)
}

function zoomAnchor(photo: HTMLImageElement, x: number, y: number): ZoomAnchor {
  const frame = fittedPhotoRect(photo)
  return {
    anchorX: Math.min(1, Math.max(0, (x - frame.left) / frame.width)),
    anchorY: Math.min(1, Math.max(0, (y - frame.top) / frame.height)),
  }
}

async function applyGestureZoom(viewport: HTMLDivElement, photo: HTMLImageElement, requestedLevel: number, anchor: ZoomAnchor, x: number, y: number) {
  const level = Math.min(4, Math.max(1, requestedLevel))
  zoomLevel.value = level
  updateZoomArea(viewport, photo)
  await nextTick()
  if (stage.value !== viewport || zoomLevel.value !== level || closingFrame.value || !track.value?.contains(photo)) {
    return
  }

  if (level > 1) {
    scrollToPhotoPoint(viewport, photo, anchor.anchorX, anchor.anchorY, x, y)
  }
  else {
    viewport.scrollTo(0, 0)
  }
}

function onZoomWheel(event: WheelEvent) {
  if (!event.ctrlKey || !event.deltaY) {
    return
  }
  event.preventDefault()

  const viewport = stage.value
  const photo = track.value?.querySelector<HTMLImageElement>('[data-slide="0"]')
  if (!viewport || !photo?.naturalWidth || trackpadPinch || pinch || isSliding() || zoomAnimation || closingFrame.value) {
    return
  }

  cancelPendingTap()
  stopOpening()
  const { clientX: x, clientY: y, deltaMode, deltaY } = event
  const pixels = deltaY * (deltaMode === 1 ? 16 : deltaMode === 2 ? viewport.clientHeight : 1)
  const factor = Math.min(1.25, Math.max(0.8, Math.exp(-pixels / 100)))
  void applyGestureZoom(viewport, photo, zoomLevel.value * factor, zoomAnchor(photo, x, y), x, y)
}

function startTrackpadPinch(event: Event) {
  event.preventDefault()
  const viewport = stage.value
  const photo = track.value?.querySelector<HTMLImageElement>('[data-slide="0"]')
  if (!viewport || !photo?.naturalWidth || pinch || isSliding() || zoomAnimation || closingFrame.value) {
    return
  }

  cancelPendingTap()
  stopOpening()
  const bounds = viewport.getBoundingClientRect()
  const { clientX, clientY } = event as MouseEvent
  const x = clientX || bounds.left + bounds.width / 2
  const y = clientY || bounds.top + bounds.height / 2
  trackpadPinch = { level: zoomLevel.value, x, y, ...zoomAnchor(photo, x, y) }
}

function moveTrackpadPinch(event: Event) {
  event.preventDefault()
  const gesture = trackpadPinch
  const viewport = stage.value
  const photo = track.value?.querySelector<HTMLImageElement>('[data-slide="0"]')
  const { scale } = event as Event & { scale: number }
  if (gesture && viewport && photo?.naturalWidth && Number.isFinite(scale)) {
    void applyGestureZoom(viewport, photo, gesture.level * scale, gesture, gesture.x, gesture.y)
  }
}

function finishTrackpadPinch() {
  trackpadPinch = undefined
}

function stopZoomAnimation() {
  zoomAnimation?.cancel()
  zoomAnimation = undefined
}

function startDrag(event: PointerEvent) {
  const viewport = stage.value
  if (!viewport || isSliding() || zoomAnimation || closingFrame.value || !event.isPrimary || event.button !== 0) {
    tapStart = undefined
    return
  }

  tapStart = { pointerId: event.pointerId, x: event.clientX, y: event.clientY }
  if ((!zoomed.value && !hasMultiple.value) || event.pointerType === 'touch') {
    return
  }

  stopOpening()
  drag = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    left: viewport.scrollLeft,
    top: viewport.scrollTop,
  }
  swipeHistory = [{ offset: 0, time: event.timeStamp }]
  viewport.setPointerCapture(event.pointerId)
}

function moveDrag(event: PointerEvent) {
  if (tapStart?.pointerId === event.pointerId && Math.hypot(event.clientX - tapStart.x, event.clientY - tapStart.y) > 10) {
    tapStart = undefined
    cancelPendingTap()
  }
  if (drag?.pointerId !== event.pointerId) {
    return
  }
  if (event.buttons === 0) {
    finishDrag(event)
    return
  }

  const horizontal = event.clientX - drag.x
  const vertical = event.clientY - drag.y
  if (zoomed.value) {
    stage.value?.scrollTo(drag.left - horizontal, drag.top - vertical)
  }
  else {
    recordSwipe(horizontal, vertical, event.timeStamp)
  }
}

function clearDrag() {
  drag = undefined
  touchStart = undefined
  touchPan = undefined
  pinch = undefined
  trackpadPinch = undefined
  dragOffset.value = 0
  swipeHistory = []
}

function finishDrag(event: PointerEvent) {
  if (drag?.pointerId !== event.pointerId) {
    return
  }

  drag = undefined
  if (!zoomed.value) {
    settleSwipe(event.timeStamp)
  }
}

function cancelDrag(event: PointerEvent) {
  if (tapStart?.pointerId === event.pointerId) {
    tapStart = undefined
    cancelPendingTap()
  }
  if (drag?.pointerId === event.pointerId) {
    drag = undefined
    settleSwipe(event.timeStamp, true)
  }
}

function isMobileGallery() {
  return window.matchMedia('(width < 40rem)').matches
}

function cancelPendingTap() {
  if (pendingTap) {
    window.clearTimeout(pendingTap.timer)
    pendingTap = undefined
  }
}

function onImageDoubleClick(event: MouseEvent) {
  if (!isMobileGallery()) {
    void toggleZoom(event)
  }
}

function onStageTap(event: MouseEvent) {
  const start = tapStart
  tapStart = undefined
  if (!start || opening.value || isSliding() || !isMobileGallery()
    || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) {
    return
  }

  const { clientX: x, clientY: y } = event
  const doubleTap = pendingTap && Math.hypot(x - pendingTap.x, y - pendingTap.y) <= 24
  cancelPendingTap()
  if (doubleTap) {
    const photo = track.value?.querySelector<HTMLImageElement>('[data-slide="0"]')
    if (photo?.naturalWidth) {
      const { left, top, width, height } = fittedPhotoRect(photo)
      const insidePhoto = x >= left && x <= left + width && y >= top && y <= top + height
      void toggleZoom(insidePhoto ? event : undefined)
    }
    return
  }
  pendingTap = { x, y, timer: window.setTimeout(() => {
    pendingTap = undefined
    void closeViewer()
  }, doubleTapDelay) }
}

function pinchMeasure(touches: TouchList) {
  const first = touches[0]
  const second = touches[1]
  if (touches.length !== 2 || !first || !second) {
    return
  }

  return {
    distance: Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY),
    x: (first.clientX + second.clientX) / 2,
    y: (first.clientY + second.clientY) / 2,
  }
}

function startTouch(event: TouchEvent) {
  const viewport = stage.value
  if (!viewport || isSliding() || zoomAnimation || closingFrame.value) {
    return
  }

  const measure = pinchMeasure(event.touches)
  if (measure) {
    clearDrag()
    tapStart = undefined
    cancelPendingTap()
    const photo = track.value?.querySelector<HTMLImageElement>('[data-slide="0"]')
    if (!photo?.naturalWidth || !measure.distance) {
      return
    }

    stopOpening()
    pinch = {
      distance: measure.distance,
      level: zoomLevel.value,
      ...zoomAnchor(photo, measure.x, measure.y),
    }
    return
  }

  const touch = event.touches.length === 1 ? event.touches[0] : undefined
  if (!touch) {
    cancelTouch(event)
    return
  }

  stopOpening()
  if (zoomed.value) {
    touchPan = { x: touch.clientX, y: touch.clientY, left: viewport.scrollLeft, top: viewport.scrollTop }
  }
  else if (hasMultiple.value) {
    touchStart = { x: touch.clientX, y: touch.clientY }
    swipeHistory = [{ offset: 0, time: event.timeStamp }]
  }
}

function moveTouch(event: TouchEvent) {
  const gesture = pinch
  const viewport = stage.value
  if (gesture) {
    const measure = pinchMeasure(event.touches)
    const photo = track.value?.querySelector<HTMLImageElement>('[data-slide="0"]')
    if (!measure || !viewport || !photo?.naturalWidth) {
      return
    }

    void applyGestureZoom(viewport, photo, gesture.level * measure.distance / gesture.distance, gesture, measure.x, measure.y)
    return
  }

  const touch = event.touches[0]
  if (touchPan && touch) {
    viewport?.scrollTo(touchPan.left + touchPan.x - touch.clientX, touchPan.top + touchPan.y - touch.clientY)
  }
  else if (touchStart && touch) {
    recordSwipe(touch.clientX - touchStart.x, touch.clientY - touchStart.y, event.timeStamp)
  }
}

function finishTouch(event: TouchEvent) {
  touchPan = undefined
  if (pinch) {
    pinch = undefined
    const remaining = event.touches[0]
    const viewport = stage.value
    if (remaining && viewport && zoomed.value) {
      touchPan = { x: remaining.clientX, y: remaining.clientY, left: viewport.scrollLeft, top: viewport.scrollTop }
    }
    return
  }

  const start = touchStart
  touchStart = undefined
  const touch = event.changedTouches[0]
  if (!start || !touch || zoomed.value || !hasMultiple.value) {
    return
  }

  recordSwipe(touch.clientX - start.x, touch.clientY - start.y, event.timeStamp)
  settleSwipe(event.timeStamp)
}

function cancelTouch(event: TouchEvent) {
  pinch = undefined
  touchPan = undefined
  if (touchStart) {
    touchStart = undefined
    settleSwipe(event.timeStamp, true)
  }
}

function recordSwipe(horizontal: number, vertical: number, time: number) {
  const width = (stage.value?.clientWidth ?? 0) + slideGap
  const offset = Math.abs(horizontal) >= Math.abs(vertical) * 0.85 ? Math.max(-width, Math.min(width, horizontal)) : 0
  swipeHistory = swipeHistory.filter((sample) => time - sample.time <= velocityWindow)
  if (offset !== dragOffset.value) {
    swipeHistory.push({ offset, time })
  }
  dragOffset.value = offset
}

function settleSwipe(time: number, cancelled = false) {
  const offset = dragOffset.value
  const first = swipeHistory.find((sample) => time - sample.time <= velocityWindow)
  const speed = first ? (offset - first.offset) / Math.max(16, time - first.time) : 0
  const flick = Math.abs(offset) >= minimumFlickDistance && speed * Math.sign(offset) >= minimumFlickSpeed
  swipeHistory = []
  if (offset) {
    const shouldSwitch = !cancelled && (Math.abs(offset) >= (stage.value?.clientWidth ?? 0) / 2 || flick)
    void moveSlide(shouldSwitch ? (offset < 0 ? 1 : -1) : 0, offset)
  }
}

function photoFrame(rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>) {
  return { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` }
}

function fitScale(photo: HTMLImageElement, width: number, height: number) {
  return Math.min(width / photo.naturalWidth, height / photo.naturalHeight)
}

function fittedPhotoRect(photo: HTMLImageElement) {
  const frame = photo.getBoundingClientRect()
  const scale = fitScale(photo, frame.width, frame.height)
  const width = photo.naturalWidth * scale
  const height = photo.naturalHeight * scale
  return { left: frame.left + (frame.width - width) / 2, top: frame.top + (frame.height - height) / 2, width, height }
}

async function animateOpening() {
  const origin = props.origin
  const preview = transitionPhoto.value
  const original = track.value?.querySelector<HTMLImageElement>('[data-slide="0"]')
  if (!origin || !preview || !original) {
    return
  }

  // Fall back to the normal viewer if the original is slow or unavailable.
  const ready = await Promise.race([
    original.decode().then(async () => {
      if (!opening.value) {
        return false
      }
      transitionSource.value = original.currentSrc || original.src
      await nextTick()
      await preview.decode()
      return true
    }).catch(() => false),
    new Promise<boolean>((resolve) => window.setTimeout(resolve, 220, false)),
  ])
  if (!opening.value) {
    return
  }
  if (!ready) {
    stopOpening()
    return
  }

  const target = photoFrame(fittedPhotoRect(original))
  openingMotion.value = true
  const animation = preview.animate([photoFrame(origin.rect), target], {
    duration: motionDuration,
    easing: 'cubic-bezier(0.2, 0.65, 0.3, 1)',
    fill: 'forwards',
  })
  openingAnimation = animation
  await animation.finished.catch(() => {})
  if (openingAnimation === animation) {
    openingAnimation = undefined
    opening.value = false
    await nextTick()
    animation.cancel()
  }
}

function stopOpening() {
  openingAnimation?.cancel()
  openingAnimation = undefined
  opening.value = false
}

async function closeViewer() {
  cancelPendingTap()
  const modal = dialog.value
  if (!modal?.open || closingFrame.value) {
    return
  }

  const photo = track.value?.querySelector<HTMLImageElement>('[data-slide="0"]')
  const thumbnail = props.type === 'image' ? props.resolveThumbnail?.(index.value) : undefined
  if (!photo?.naturalWidth || !thumbnail || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    modal.close()
    return
  }

  const start = transitionPhoto.value?.getBoundingClientRect() ?? fittedPhotoRect(photo)
  const initialTarget = thumbnail.getBoundingClientRect()
  if (initialTarget.bottom <= 0 || initialTarget.top >= window.innerHeight) {
    thumbnail.scrollIntoView({ block: 'nearest', behavior: 'instant' })
  }
  const target = thumbnail.getBoundingClientRect()
  if (!target.width || !target.height) {
    modal.close()
    return
  }

  closingFrame.value = start
  transitionSource.value = photo.currentSrc || photo.src
  stopOpening()
  stopZoomAnimation()
  stopSlide()
  clearDrag()
  await nextTick()
  const preview = transitionPhoto.value
  if (!preview || !modal.open) {
    modal.close()
    return
  }

  closingMotion.value = true
  const animation = preview.animate([photoFrame(start), photoFrame(target)], {
    duration: motionDuration,
    easing: 'cubic-bezier(0.2, 0.65, 0.3, 1)',
    fill: 'forwards',
  })
  closingAnimation = animation
  await animation.finished.catch(() => {})
  if (closingAnimation === animation) {
    closingAnimation = undefined
    modal.close()
    thumbnail.closest('button')?.focus({ preventScroll: true })
  }
}

onMounted(() => {
  window.addEventListener('pointerup', finishDrag, true)
  window.addEventListener('pointercancel', cancelDrag, true)
  dialog.value?.showModal()
  if (stage.value) {
    stageResizeObserver = new ResizeObserver(() => {
      const viewport = stage.value
      const photo = track.value?.querySelector<HTMLImageElement>('[data-slide="0"]')
      if (zoomed.value && viewport && photo?.naturalWidth) {
        updateZoomArea(viewport, photo)
      }
    })
    stageResizeObserver.observe(stage.value)
  }
  void animateOpening()
})

onBeforeUnmount(() => {
  cancelPendingTap()
  stopSlide()
  closingAnimation?.cancel()
  closingAnimation = undefined
  stopOpening()
  stopZoomAnimation()
  stageResizeObserver?.disconnect()
  window.removeEventListener('pointerup', finishDrag, true)
  window.removeEventListener('pointercancel', cancelDrag, true)
  dialog.value?.close()
})
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      :aria-label="`${mediaLabel}预览`"
      class="moment-media-viewer fixed inset-0 m-auto h-dvh max-h-none w-full max-w-none overflow-hidden p-0 text-[#999] backdrop:bg-black"
      :class="[origin || closingFrame ? 'bg-transparent' : 'bg-black', { 'viewer-from-thumbnail': origin, 'viewer-closing': closingMotion }]"
      @close="emit('close')"
      @cancel.prevent="closeViewer"
      @keydown.esc.prevent="closeViewer"
      @keydown.left.prevent="hasMultiple && moveSlide(-1)"
      @keydown.right.prevent="hasMultiple && moveSlide(1)"
    >
      <div class="viewer-chrome flex h-full flex-col" :inert="!!closingFrame">
        <div
          class="flex shrink-0 items-center justify-end"
          :class="type === 'image'
            ? 'pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-linear-to-b from-black/65 to-transparent text-white/85'
            : 'h-12'"
        >
          <span role="status" class="sr-only">{{ mediaLabel }} {{ index + 1 }} / {{ items.length }}</span>
          <div class="pointer-events-auto flex items-center gap-2" :class="type === 'image' ? 'pr-5' : 'pr-3'">
            <template v-if="type === 'image'">
              <UButton
                v-bind="viewerButton"
                type="button"
                :icon="zoomed ? 'heroicons:magnifying-glass-minus' : 'heroicons:magnifying-glass-plus'"
                aria-label="放大图片"
                :aria-pressed="zoomed"
                @click="toggleZoom()"
              />
              <UButton
                v-bind="viewerButton"
                :href="current.src"
                external
                download
                icon="heroicons:arrow-down-tray"
                aria-label="下载图片"
                class="border-b-0!"
              />
            </template>
            <UButton
              v-bind="viewerButton"
              type="button"
              autofocus
              icon="heroicons:x-mark"
              aria-label="关闭"
              @click="closeViewer"
            />
          </div>
        </div>

        <div class="relative flex min-h-0 flex-1 items-center justify-center">
          <div
            v-if="type === 'image'"
            ref="stage"
            class="viewer-image-stage absolute inset-0 touch-none overscroll-contain select-none"
            :class="[(opening || closingFrame) && 'opacity-0', zoomed
              ? 'cursor-grab overflow-auto active:cursor-grabbing'
              : hasMultiple ? 'cursor-grab overflow-hidden active:cursor-grabbing' : 'cursor-zoom-in overflow-hidden']"
            @click="onStageTap"
            @dblclick="onImageDoubleClick"
            @pointerdown="startDrag"
            @pointermove="moveDrag"
            @lostpointercapture="finishDrag"
            @wheel="onZoomWheel"
            @gesturestart="startTrackpadPinch"
            @gesturechange="moveTrackpadPinch"
            @gestureend="finishTrackpadPinch"
            @touchstart.passive="startTouch"
            @touchmove.passive="moveTouch"
            @touchend.passive="finishTouch"
            @touchcancel="cancelTouch"
          >
            <div
              ref="track"
              class="relative"
              :class="{ 'size-full': !zoomed }"
              :style="[zoomed ? zoomArea : undefined, { transform: dragOffset ? `translateX(${dragOffset}px)` : undefined }]"
            >
              <img
                v-for="slide in slides"
                :key="slide.position"
                :src="slide.item.src"
                :alt="slide.offset ? '' : `第 ${index + 1} 张图片`"
                :aria-hidden="slide.offset ? true : undefined"
                :data-slide="slide.offset"
                :fetchpriority="slide.offset ? 'low' : 'auto'"
                class="absolute top-0 size-full object-contain"
                :style="{ left: `calc(${slide.offset * 100}% + ${slide.offset * slideGap}px)` }"
                draggable="false"
                @load="loadedImages.add(slide.item.src)"
                @error="loadedImages.add(slide.item.src)"
              >
            </div>
          </div>
          <iframe
            v-else
            :key="current.src"
            :src="current.src"
            title="PeerTube 视频"
            class="size-full border-0 bg-black"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
            @load="videoLoading = false"
          />

          <div v-if="showLoading" role="status" class="pointer-events-none absolute inset-0 grid place-items-center">
            <span class="size-7 rounded-full border-2 border-white/25 border-t-white motion-safe:animate-spin" aria-hidden="true" />
            <span class="sr-only">正在加载{{ mediaLabel }}</span>
          </div>

          <div
            v-if="hasMultiple"
            class="pointer-events-none absolute inset-0 z-10 items-center justify-between px-5 motion-safe:transition-opacity motion-safe:duration-300"
            :class="[type === 'image' ? 'hidden sm:flex' : 'flex', opening && !openingMotion ? 'opacity-0' : 'opacity-100']"
            :inert="opening"
          >
            <UButton
              v-bind="viewerButton"
              type="button"
              icon="heroicons:arrow-left"
              class="pointer-events-auto"
              :aria-label="`上一个${mediaLabel}`"
              @click="moveSlide(-1)"
            />
            <UButton
              v-bind="viewerButton"
              type="button"
              icon="heroicons:arrow-right"
              class="pointer-events-auto"
              :aria-label="`下一个${mediaLabel}`"
              @click="moveSlide(1)"
            />
          </div>
          <div
            v-if="hasMultiple"
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2 sm:hidden"
          >
            <span
              v-for="dotNumber in items.length"
              :key="dotNumber"
              class="size-2 rounded-full"
              :class="dotNumber === index + 1 ? 'bg-white' : 'bg-white/40'"
            />
          </div>
        </div>

        <div v-if="hasMultiple && items.every(item => item.thumbnail)" class="hidden shrink-0 bg-[#100d0e] px-2 py-2.5 sm:block">
          <div class="mx-auto flex w-fit max-w-full gap-[5px] overflow-x-auto">
            <button
              v-for="(item, thumbnailIndex) in items"
              :key="item.src"
              type="button"
              class="h-20 w-[100px] shrink-0 cursor-pointer overflow-hidden rounded-sm border-2 border-neutral-100 hover:border-primary-400 aria-[current=true]:border-primary-400"
              :aria-label="`查看${mediaLabel} ${thumbnailIndex + 1}`"
              :aria-current="thumbnailIndex === index ? 'true' : undefined"
              @click="selectThumbnail(thumbnailIndex)"
            >
              <img :src="item.thumbnail" alt="" class="size-full object-cover">
            </button>
          </div>
        </div>
      </div>
      <img
        v-if="transitionFrame"
        ref="transitionPhoto"
        :src="transitionSource"
        alt=""
        aria-hidden="true"
        class="pointer-events-none fixed z-1 max-w-none object-cover"
        :style="photoFrame(transitionFrame)"
      >
    </dialog>
  </Teleport>
</template>

<style scoped>
.viewer-image-stage {
  scrollbar-width: none;
}

.viewer-image-stage::-webkit-scrollbar {
  display: none;
}

@media (prefers-reduced-motion: no-preference) {
  .moment-media-viewer[open]:not(.viewer-from-thumbnail),
  .moment-media-viewer[open]::backdrop {
    animation: viewer-enter 300ms ease-out;
  }

  .moment-media-viewer[open]:not(.viewer-from-thumbnail) .viewer-image-stage {
    animation: viewer-image-enter 300ms cubic-bezier(0.2, 0.65, 0.3, 1);
  }

  .moment-media-viewer.viewer-closing[open]::backdrop {
    animation: viewer-enter 300ms ease-out reverse both;
  }

  .moment-media-viewer.viewer-closing[open] .viewer-chrome {
    /* Mirror the photo's easing because the fade keyframes run in reverse. */
    animation: viewer-enter 300ms cubic-bezier(0.7, 0, 0.8, 0.35) reverse both;
  }
}

@keyframes viewer-enter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes viewer-image-enter {
  from {
    scale: 0.97;
  }
  to {
    scale: 1;
  }
}

:global(html:has(.moment-media-viewer[open])) {
  overflow: hidden;
}
</style>
