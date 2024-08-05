<script lang="ts" setup>
import Artalk from 'artalk'

const props = defineProps({
  path: {
    type: String,
  },
  title: {
    type: String,
  },
})
const siteConfig = useSiteConfig()
let artalk: Artalk
const artalkEl = ref<HTMLElement>()

onMounted(() => {
  artalk = Artalk.init({
    el: artalkEl.value,
    pageKey: props.path,
    pageTitle: props.title,
    server: 'https://artalk.hadb.me/',
    site: siteConfig.name,
  })
})

onBeforeUnmount(() => {
  artalk?.destroy()
})
</script>

<template>
  <div ref="artalkEl" class="artalk p-4 sm:p-6 rounded-lg bg-slate-50 dark:bg-slate-900 outline outline-1 outline-slate-200 dark:outline-slate-700" />
</template>

<style lang="scss">
.artalk,
.atk-layer-wrap {
  --at-color-font: theme('colors.slate.700');
  --at-color-deep: theme('colors.primary.500');
  --at-color-sub: theme('colors.slate.500');
  --at-color-grey: theme('colors.slate.500');
  --at-color-meta: theme('colors.slate.600');
  --at-color-border: theme('colors.slate.200');
  --at-color-light: theme('colors.primary.400');
  --at-color-bg: theme('colors.white');
  --at-color-bg-transl: rgba(255, 255, 255, 0.95); // white, 0.95
  --at-color-bg-grey: theme('colors.slate.200');
  --at-color-bg-grey-transl: rgba(226, 232, 240, 0.75); // slate.200, 0.75
  --at-color-bg-light: rgba(96, 165, 250, 0.1); // primary.400, 0.1
  --at-color-main: theme('colors.primary.500');
  --at-color-red: theme('colors.red.500');
  --at-color-pink: theme('colors.pink.500');
  --at-color-yellow: theme('colors.yellow.500');
  --at-color-green: theme('colors.green.500');
  --at-color-gradient: linear-gradient(180deg, transparent, theme('colors.slate.50'));

  &:is(.dark *) {
    --at-color-font: theme('colors.slate.300');
    --at-color-deep: theme('colors.slate.500');
    --at-color-sub: theme('colors.slate.500');
    --at-color-grey: theme('colors.slate.500');
    --at-color-meta: theme('colors.slate.400');
    --at-color-border: theme('colors.slate.700');
    --at-color-light: theme('colors.primary.600');
    --at-color-bg: theme('colors.slate.800');
    --at-color-bg-transl: rgba(30, 41, 59, 0.95); // slate.800, 0.95
    --at-color-bg-grey: theme('colors.slate.700');
    --at-color-bg-grey-transl: rgba(51, 65, 85, 0.75); // slate.700, 0.75
    --at-color-bg-light: rgba(96, 165, 250, 0.1); // primary.400, 0.1
    --at-color-main: theme('colors.primary.500');
    --at-color-red: theme('colors.red.500');
    --at-color-pink: theme('colors.pink.500');
    --at-color-yellow: theme('colors.yellow.500');
    --at-color-green: theme('colors.green.500');
    --at-color-gradient: linear-gradient(180deg, transparent, theme('colors.slate.900'));
  }

  .atk-main-editor > .atk-bottom .atk-send-btn {
    color: theme('colors.white');
    margin: 5px;
  }
  .atk-auth-plugin-dialog {
    border: 1px solid var(--at-color-border);
  }
  .atk-auth-plugin-dialog .atk-form button[type='submit'] {
    color: theme('colors.white');
  }
  .atk-layer-dialog {
    padding: 15px;
    background-color: var(--at-color-bg);
    border: 1px solid var(--at-color-border);
  }
  .atk-comment > .atk-main > .atk-footer .atk-actions > span {
    font-size: theme('fontSize.sm');
  }
  .atk-comment > .atk-main > .atk-header {
    font-size: theme('fontSize.sm');
  }
  .atk-comment > .atk-main > .atk-header .badge,
  .atk-comment > .atk-main > .atk-header .atk-ua,
  .atk-comment > .atk-main > .atk-header .atk-pinned-badge,
  .atk-comment > .atk-main > .atk-header .atk-region-badge,
  .atk-comment > .atk-main > .atk-header .atk-badge {
    font-size: theme('fontSize.xs');
    padding: 2px 6px;
    line-height: 18px;
    border-radius: 4px;
  }
  .atk-comment-wrap {
    border-bottom: 1px solid var(--at-color-border);
    &:first-child {
      border-top: 1px solid var(--at-color-border);
    }
    &:last-child {
      border-bottom: none;
    }

    > .atk-comment {
      padding: 10px 0;
    }
  }
  .atk-comment-children > .atk-comment-wrap > .atk-comment {
    padding: 10px 0;
  }
}
</style>